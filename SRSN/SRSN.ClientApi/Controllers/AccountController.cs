using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        
        private UserManager<SRSNUser> userManager;
        private IMapper mapper;
        public AccountController(UserManager<SRSNUser> userManager, IMapper mapper)
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
            
            await userManager.CreateAsync(user, data.Password);
            return Ok(new { message = "register thanh cong" });

        }


        [HttpPost("login")]
        public async Task<ActionResult> Login([FromQuery] string username, [FromQuery] string password)
        {
            var user = await userManager.FindByNameAsync(username);
            if(user != null)
            {
                var isCorrect = await userManager.CheckPasswordAsync(user, password);
                if (!isCorrect)
                {
                    return Unauthorized();
                }
                else
                {
                    var token = await user.AuthorizeAsync(userManager, user);
                    return Ok(token);
                }
            }
            else
            {
                return Unauthorized();
            }
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
        [HttpGet("get-top-ten")]
        [AllowAnonymous]
        public async Task<IEnumerable<AccountViewModel>> GetTopUser()
        {
            var list = new List<AccountViewModel>();
            foreach (var u in userManager.Users.ToList().OrderByDescending(u => u.Point).Take(10))
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
                    Phone = u.Phone ,
                    Point = u.Point
                    
                });
            }
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
                    Point = u.Point

                });
            }
            return list;
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
            if(result.Succeeded)
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
    }

}