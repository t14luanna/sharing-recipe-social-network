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
        public async Task<ActionResult> ReadFollowingUser(string userName)
        {
            try
            {
                var user = await userManager.FindByNameAsync(userName);
                int userid = user.Id;
                return Ok(await userFollowingService.getAllFollowingUser(userManager, userid));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("unfollow-user")]
        public async Task<ActionResult> UnfollowUser(String userName, int userId)
        {
            try
            {
                var user = await userManager.FindByNameAsync(userName);
                return Ok(await userFollowingService.unfollowFollowingUser(userManager, user.Id, userId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
