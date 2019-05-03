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
    public class UserReportRecipeController : ControllerBase
    {
        private IUserReportRecipeService userReportRecipeService;
        private UserManager<SRSNUser> userManager;

        public UserReportRecipeController(IUserReportRecipeService userReportRecipeService, UserManager<SRSNUser> userManager)
        {
            this.userReportRecipeService = userReportRecipeService;
            this.userManager = userManager;
        }

        [HttpPost("create-report-recipe")]
        [Authorize]
        public async Task<ActionResult> CreateRecipeReport([FromBody]UserReportRecipeViewModel request)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                request.UserId = int.Parse(userId);
                request.CreateTime = DateTime.UtcNow.AddHours(7);
                request.IsActive = true;
                await userReportRecipeService.CreateAsync(request);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("get-all-reported-recipe")]
        public async Task<ActionResult> GetAllReportedUser()
        {
            try
            {
                return Ok(await userReportRecipeService.GetAllReportedRecipe(this.userManager));//them await chổ này để trả về json ko có chữ result 
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

       

    }
}