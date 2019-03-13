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
    public class RatingRecipeController : ControllerBase
    {
        private UserManager<SRSNUser> userManager;
        private IRatingRecipeService ratingRecipeService;

        public RatingRecipeController(UserManager<SRSNUser> userManager, IRatingRecipeService ratingRecipeService)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.ratingRecipeService = ratingRecipeService ?? throw new ArgumentNullException(nameof(ratingRecipeService));
        }
        [HttpPost("like")]
        [Authorize]
        public async Task<ActionResult> LikePost([FromBody]UserReactionViewModel likePostViewModel)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                likePostViewModel.UserId = int.Parse(userId);
                //var existedUser = await likePostService.FirstOrDefaultAsync(p => p.PostId == likePostViewModel.PostId && p.UserId == likePostViewModel.UserId);
                //if (existedUser.Id != 0)
                //{
                //    return Ok(new
                //    {
                //        status = 5,
                //        message = "Ban like khong thanh cong vi Duplicate"
                //    });
                //}

                //await likePostService.CreateAsync(likePostViewModel);
                return Ok(new
                {
                    message = "Bạn đã LIKE thanh cong"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost("create-rating")]
        [Authorize]
        public async Task<ActionResult> CreateRating([FromBody]RatingRecipeViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = int.Parse(userId);
            if (request.Star == null || request.Star == 0)
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
            return Ok(new
            {
                message = "Update Rating sucessfull"
            });
        }
        [HttpGet("read-rating")]
        public async Task<ActionResult> ReadCommentRecipe(int recipeId)
        {
            try
            {
                return Ok(await ratingRecipeService.GetRatingComment(this.userManager, recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}