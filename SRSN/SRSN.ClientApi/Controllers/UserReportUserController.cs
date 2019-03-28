using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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
    public class UserReportUserController : ControllerBase
    {
        private IUserReportUserService userReportUserService;
        private UserManager<SRSNUser> userManager;

        public UserReportUserController(IUserReportUserService userReportUserService, UserManager<SRSNUser> userManager)
        {
            this.userReportUserService = userReportUserService;
            this.userManager = userManager;
        }

        [HttpPost("create-report-user")]
        [Authorize]
        public async Task<ActionResult> CreateReportedUser([FromBody]UserReportUserViewModel request)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                request.UserId = int.Parse(userId);
                request.CreateTime = DateTime.UtcNow.AddHours(7);
                await userReportUserService.CreateAsync(request);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("get-reported-user")]
        public async Task<ActionResult> GetAllReportedUser()
        {
            try
            {
                return Ok(await userReportUserService.GetAllReportedUser(this.userManager));//them await chổ này để trả về json ko có chữ result 
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}