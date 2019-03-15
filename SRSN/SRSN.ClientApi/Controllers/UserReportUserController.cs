using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserReportUserController : ControllerBase
    {
        private IUserReportUserService userReportUserService;

        public UserReportUserController(IUserReportUserService userReportUserService)
        {
            this.userReportUserService = userReportUserService;
        }

        [HttpPost("create-report-user")]
        [Authorize]
        public async Task<ActionResult> CreateRecipeReport([FromBody]UserReportUserViewModel request)
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
    }
}