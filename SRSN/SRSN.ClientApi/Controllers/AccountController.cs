using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SRSN.DatabaseManager;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Redis;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;
using StackExchange.Redis;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private string rankFriendsPrefix = "RCS_Friends_";
        private SRSNUserManager userManager;
        private IDatabase redisDatabase;
        private IMapper mapper;
        private readonly IUserFollowingService ufService;
        public AccountController(SRSNUserManager userManager, IUserFollowingService ufService, IMapper mapper)
        {
            this.userManager = userManager;
            this.mapper = mapper;
            this.redisDatabase = RedisUtil.Connection.GetDatabase();
            this.ufService = ufService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] AccountEditViewModel data)
        {
            // check existed user
            var existedUsername = await userManager.FindByNameAsync(data.UsernameVM);
            var existedEmail = await userManager.FindByEmailAsync(data.Email);
            if (existedUsername != null )
            {
                return Ok(new { message = "Tên đăng nhập đã tồn tại, vui lòng nhập tên khác!" });
            }

            if(existedEmail != null)
            {
                return Ok(new { message = "Địa chỉ email đã tồn tại, vui lòng nhập email khác!" });
            }
            var user = new SRSNUser();
            mapper.Map(data, user);
            user.SecurityStamp = Guid.NewGuid().ToString();
            user.UserName = data.UsernameVM;
            user.Active = true;

            if (data.Password != data.ConfirmPassword)
            {
                return BadRequest();
            }

            var result = await userManager.CreateAsync(user, data.Password);
            if (result.Succeeded)
            {
                var existedUser = await userManager.FindByNameAsync(user.UserName);
                var addToRoleResult = await userManager.AddToRoleAsync(existedUser, "ActiveUser");
                var token = await user.AuthorizeAsync(userManager, existedUser);
                var increasePointResult = userManager.IncreasePoint(user, (int)IncreasePointRuleEnum.FirstLogin);
                var updateDefaultImage = userManager.UpdateAvatarDefault(user);
                return Ok(new
                {
                    message = "register thanh cong",
                    success = true,
                    token = token,
                    username = user.UserName,
                    userId = user.Id
                });
            }
            else
            {
                return Ok(new { message = "register that bai", errors = JsonConvert.SerializeObject(result.Errors) });
            }
        }


        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] AccountEditViewModel data)
        {
            var user = await userManager.FindByNameAsync(data.UsernameVM);
            string messg = "";

            if (user != null && userManager.FindByNameAsync(data.UsernameVM).Result.Active == true)
            {

                var isCorrect = await userManager.CheckPasswordAsync(user, data.Password);
                if (isCorrect)
                {
                    var token = await user.AuthorizeAsync(userManager, user);
                    return Ok(new
                    {
                        message = "Đăng nhập thành công",
                        success = true,
                        token = token,
                        username = user.UserName,
                        userId = user.Id
                    });
                }
            }
            else if (user != null && userManager.FindByNameAsync(data.UsernameVM).Result.Active == false)
            {
                messg = "Tài khoảng đã bị khóa!";
            }
            else
            {
                messg = "Đăng nhập thất bại, tên đăng nhập hoặc mật khẩu không chính xác.";
            }


            return Ok(new
            {
                message = messg,
                success = false,
            });
        }

        [HttpGet("read")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadByUserId(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if(user.Active == true)
            {
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);
                return Ok(userVM);
            }
            else
            {
                return NotFound();
            }
        }
        //[HttpGet("read-username-profile")]
        //[AllowAnonymous]
        //public async Task<ActionResult> ReadByUserName(string userName)
        //{
        //    var user = await userManager.FindByNameAsync(userName);
        //    var userVM = new AccountViewModel();
        //    mapper.Map(user, userVM);
        //    return Ok(userVM);
        //}


        [HttpGet("get-top-ten")]
        [AllowAnonymous]
        public async Task<IEnumerable<AccountViewModel>> GetTopUser()
        {
            var list = new List<AccountViewModel>();
            foreach (var u in userManager.Users.ToList().OrderByDescending(u => u.Point).Take(13))
            {
                var user = u;
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);
                list.Add(userVM);
            }
            return list;
        }

        [HttpGet("get-top-suggest-friends")]
        [Authorize]
        public async Task<IEnumerable<AccountViewModel>> GetTopSuggestFriends()
        {
            var list = new List<AccountViewModel>();
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userIdInt =int.Parse(userId);
            var key = $"{rankFriendsPrefix}{userId}";

            // take limit from redis
            var datas = await redisDatabase.SortedSetRangeByScoreWithScoresAsync(key);
            var dataIds = datas.Select(x =>
            {
                int friendId = 0;
                int.TryParse(x.Element, out friendId);
                return friendId;
            }).ToList();
            var listFollowedUser = ufService.GetAllFollowUser(userIdInt, 1000, 0).Select(x=>x.Id);
            var listUnfollowedUserIds = dataIds.Where(x => !listFollowedUser.Contains(x));
            foreach (var u in userManager.Users.Where(x=>listUnfollowedUserIds.Contains(x.Id)).ToList().Take(5))
            {
                var user = u;
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);
                list.Add(userVM);
            }
            return list;
        }
        [HttpGet("get-all-user")]
        [AllowAnonymous]
        public async Task<IEnumerable<AccountViewModel>> GetAllUser(int limit = 23, int page = 0)
        {
            var list = new List<AccountViewModel>();
            var listUserEntity = userManager.Users.ToList().OrderByDescending(u => u.Point).Where(p => p.Active == true);
            foreach (var u in listUserEntity)
            {
                var user = u;
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);
                list.Add(userVM);
            }
            list = list.Skip(page * limit).Take(limit).ToList();
            return list;
        }

        [HttpGet("get-popular")]
        [AllowAnonymous]
        public async Task<IEnumerable<AccountViewModel>> GetPopular()
        {
            var list = new List<AccountViewModel>();
            foreach (var u in userManager.Users.ToList().OrderByDescending(u => u.Point).Take(1))
            {
                list.Add(new AccountViewModel()
                {
                    Id = u.Id,
                    Username = u.UserName,
                    FirstName = u.FirstName,
                    Address = u.Address,
                    Birthdate = u.Birthdate,
                    Email = u.Email,
                    Gender = u.Gender,
                    LastName = u.LastName,
                    Phone = u.Phone,
                    Point = u.Point,
                    Description = u.Description,
                    AvatarImageUrl = u.AvatarImageUrl
                });
            }
            return list;
        }
        [HttpGet("read-userinfo")]
        public async Task<ActionResult> readUserFromToken()
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;

            var user = await userManager.FindByIdAsync(userId);
            var userVM = new AccountViewModel();
            mapper.Map(user, userVM);
            return Ok(userVM);

        }
        [HttpGet("read-username")]
        public async Task<ActionResult<AccountViewModel>> findUsername(string username)
        {
            try
            {
                var isCorrect = userManager.Users.Where(u => u.UserName.Equals(username) && u.Active == true).FirstOrDefault();
                var accountVM = new AccountViewModel();
                mapper.Map(isCorrect, accountVM);
                return Ok(accountVM);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet("find-user")]
        public async Task<ActionResult<AccountViewModel>> FindUser(string name)
        {
            try
            {
                var list = new List<AccountViewModel>();
                foreach (var u in userManager.Users.Where(u => u.FirstName.Contains(name) || u.LastName.Contains(name)).ToList().OrderByDescending(t => t.Id))
                {
                    var accountVM = new AccountViewModel();
                    mapper.Map(u, accountVM);
                    list.Add(accountVM);

                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        [HttpPut("update")]
        [Authorize]
        public async Task<ActionResult> UpdateProfile([FromBody] AccountEditViewModel data)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;

            var currentUser = await userManager.FindByIdAsync(userId);
            mapper.Map(data, currentUser);
            await userManager.UpdateAsync(currentUser);

            return Ok(new
            {
                message = $"Ban da update thanh cong User co ten la: {currentUser.UserName}"
            });
        }
        [HttpPost("update-activation")]
        public async Task<ActionResult> UpdateUser(int reportedUserId)
        {
            try
            {

                var currentUser = await userManager.FindByIdAsync(reportedUserId.ToString());
                currentUser.Active = currentUser.Active ? false : true;
                await userManager.UpdateAsync(currentUser);

                return Ok(new
                {
                    active = currentUser.Active,
                    message = "Cập nhật thành công!"
                });

            }
            catch (Exception)
            {

                return BadRequest();
            }
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordViewModel data)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;

            var currentUser = await userManager.FindByIdAsync(userId);
            var result = await userManager.ChangePasswordAsync(currentUser, data.CurrentPassword, data.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new
                {
                    message = $"Ban da doi password thanh cong User co ten la: {currentUser.UserName}"
                });
            }
            else
            {
                return Ok(new
                {
                    message = result.ToString()
                });
            }
        }

        [HttpGet("reset-password")]
        [Authorize]
        public async Task<ActionResult> RegetPassword([FromBody]string username)
        {
            //ClaimsPrincipal claims = this.User;
            //var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            //var currentUser = await userManager.FindByIdAsync(userId);
            //if(currentUser!= null) { }
            ////var result = await userManager.ChangePasswordAsync(currentUser, data.CurrentPassword, data.NewPassword);
            //if (result.Succeeded)
            //{
            //    return Ok(new
            //    {
            //        message = $"Ban da doi password thanh cong User co ten la: {currentUser.UserName}"
            //    });
            //}
            //else
            //{
            //    return Ok(new
            //    {
            //        message = result.ToString()
            //    });
            //}
            return Ok();
        }

        [HttpGet("read-profile-token")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadByToken()
        {
            var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
            var user = await userManager.FindByIdAsync(userId);
            var userVM = new AccountViewModel();
            mapper.Map(user, userVM);
            return Ok(userVM);
        }

        [HttpPost("read-user-list")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadListByUserId([FromBody]List<String> userId)
        {
            var list = new List<AccountViewModel>();
            foreach (string id in userId)
            {
                var user = await userManager.FindByIdAsync(id);
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);
                list.Add(userVM);
            }
            return Ok(list);
        }
    }
}