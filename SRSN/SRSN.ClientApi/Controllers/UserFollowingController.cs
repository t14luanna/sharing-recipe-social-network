using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserFollowingController : ControllerBase
    {
        private IUserFollowingService userFollowingService;
        private UserManager<SRSNUser> userManager;

        public UserFollowingController(IUserFollowingService userFollowingService, UserManager<SRSNUser> userManager)
        {
            this.userFollowingService = userFollowingService ;
            this.userManager = userManager ;
        }

        [HttpGet("read-following-user")]
        public async Task<ActionResult> ReadFollowingUser(int userId)
        {
            try
            {
                return Ok(await userFollowingService.getAllFollowingUser(userManager, userId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
