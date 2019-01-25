using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Identities;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private UserManager<SRSNUser> userManager;
        public AccountController(UserManager<SRSNUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet("register")]
        public async Task<ActionResult> Register([FromQuery] string username, [FromQuery] string password)
        {
            var user = new SRSNUser()
            {
                UserName = username,
                SecurityStamp = Guid.NewGuid().ToString(),
                Email = username
            };

            await userManager.CreateAsync(user, password);

            return Ok(new { message = "Tao thanh cong user nao do" });
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


    }

}