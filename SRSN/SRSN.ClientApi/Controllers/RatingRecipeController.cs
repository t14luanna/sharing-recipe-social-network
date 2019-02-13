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
    public class RatingRecipeController : ControllerBase
    {
        private IRatingRecipeService ratingRecipeService;
        public RatingRecipeController(IRatingRecipeService ratingRecipeService)
        {
            this.ratingRecipeService = ratingRecipeService;
        }

        [HttpPost("createRating")]
        [Authorize]
        public async Task<ActionResult> CreateRating([FromBody]RatingRecipeViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = int.Parse(userId);
            if(request.Star == null || request.Star == 0)
            {
                return Ok(new
                {
                    message = "Rating star please"
                });
            }
            await ratingRecipeService.CreateAsync(request);
            return Ok(new
            {
                message = "Rating recipe successfull"
            });
        }

        [HttpPut("updateRating")]
        [Authorize]
        public async Task<ActionResult> UpdateRating([FromBody]RatingRecipeViewModel request)
        {
            if (request.Star == null || request.Star == 0)
            {
                return Ok(new
                {
                    message = "Rating star please"
                });
            }

            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = int.Parse(userId);
            await ratingRecipeService.UpdateAsync(request);
            return Ok(new {
                message = "Update Rating sucessfull"
            });
        }
    }
}