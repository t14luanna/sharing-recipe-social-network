﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
        [HttpPost("check-following-user")]
        public async Task<ActionResult> CheckFollowingUser(int followingUserId)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var id = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                int userId = int.Parse(id);
                return Ok(await userFollowingService.checkFollowingUser(userId, followingUserId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
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

        [HttpGet("read-user-following-me")]
        public async Task<ActionResult> ReadUserFollowingMe(string userName)
        {
            try
            {
                var user = await userManager.FindByNameAsync(userName);
                int followingUserId = user.Id;
                return Ok(await userFollowingService.getAllUserFollowingMe(userManager, followingUserId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-user-following-me-by-id")]
        public async Task<ActionResult> ReadUserFollowingMeByUserId(int followingUserId)
        {
            try
            {
                return Ok(await userFollowingService.getAllUserFollowingMe(userManager, followingUserId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("unfollow-user")]
        public async Task<ActionResult> UnfollowUser(String userName, int userFollowingId)
        {
            try
            {
                var user = await userManager.FindByNameAsync(userName);
                return Ok(new {
                    data = await userFollowingService.unfollowFollowingUser(userManager, user.Id, userFollowingId),
                    success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("follow-user")]
        public async Task<ActionResult> FollowUser(String userName, int userFollowingId)
        {
            try
            {
                var user = await userManager.FindByNameAsync(userName);
                return Ok(new
                {
                    data = await userFollowingService.followUser(userManager, user.Id, userFollowingId),
                    success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        
    }
}
