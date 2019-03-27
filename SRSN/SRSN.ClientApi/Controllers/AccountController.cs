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
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private SRSNUserManager userManager;
        private IMapper mapper;
        public AccountController(SRSNUserManager userManager, IMapper mapper)
        {
            this.userManager = userManager;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] AccountEditViewModel data)
        {
            // check existed user
            var existedUsername = await userManager.FindByNameAsync(data.UsernameVM);
            if (existedUsername != null)
            {
                return Ok(new { message = "Username da ton tai" });
            }

            var user = new SRSNUser();
            mapper.Map(data, user);
            user.SecurityStamp = Guid.NewGuid().ToString();
            user.UserName = data.UsernameVM;

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
            if (user != null)
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

            return Ok(new
            {
                message = "Đăng nhập thất bại, tên đăng nhập hoặc mật khẩu không chính xác.",
                success = false,
            });
        }

        [HttpGet("read")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadByUserId(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            var userVM = new AccountViewModel();
            mapper.Map(user, userVM);
            return Ok(userVM);
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
        [HttpGet("get-all-user")]
        [AllowAnonymous]
        public async Task<IEnumerable<AccountViewModel>> GetAllUser(int limit = 23, int page = 0)
        {
            var list = new List<AccountViewModel>();
            foreach (var u in userManager.Users.ToList().OrderByDescending(u => u.Point))
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
                var isCorrect = userManager.Users.Where(u => u.UserName.Equals(username)).FirstOrDefault();
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
    }
}