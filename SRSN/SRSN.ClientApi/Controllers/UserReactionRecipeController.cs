using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserReactionRecipeController : ControllerBase
    {
        private SRSNUserManager userManager;
        private IUserReactionRecipeService selfService;

        public UserReactionRecipeController(IUserReactionRecipeService selfService, SRSNUserManager userManager)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.selfService = selfService;
        }
        [HttpPost("create-rating")]
        [Authorize]
        public async Task<ActionResult> CreateRating([FromBody]UserReactionRecipeViewModel request)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                var user = await this.userManager.FindByIdAsync(userId);
                request.UserId = int.Parse(userId);

                if (request.RatingRecipe == null || request.RatingRecipe == 0)
                {
                    return Ok(new
                    {
                        message = "Rating star please"
                    });
                }

                var existingUserReaction = await selfService.FirstOrDefaultAsync(x => x.UserId == request.UserId && x.RecipeId == request.RecipeId);
                request.RatingTime = DateTime.UtcNow.AddHours(7);
                if (existingUserReaction == null)
                {
                    await selfService.UpdateRecipeRating(request.RecipeId, request.RatingRecipe.Value);
                    await selfService.CreateAsync(request);
                    
                }
                else
                {
                    if(existingUserReaction.RatingRecipe == null)
                    {
                        existingUserReaction.RatingRecipe = request.RatingRecipe.Value;
                        existingUserReaction.RatingContent = request.RatingContent;
                        existingUserReaction.RatingTime = request.RatingTime;
                        await selfService.UpdateAsync(existingUserReaction);
                    }
                    else
                    {
                        return BadRequest(new
                        {
                            message = "Rating recipe exception"
                        });
                    }
                }

                if(!request.RatingContent.IsNullOrEmpty())
                {
                    var increasePointResult = userManager.IncreasePoint(user, (int)IncreasePointRuleEnum.RatingRecipeAndReview);
                }

                return Ok(new
                {
                    message = "Rating recipe successfull"
                });
            } catch(Exception ex)
            {
                return BadRequest(new
                {
                    message = "Rating recipe exception"
                });
            }
        }
        [HttpGet("read-reactions")]
        public async Task<ActionResult> ReadReactions([FromQuery]int recipeId, [FromQuery]int limit = 100)
        {
            try
            {
                var userReactions = await selfService.Get(x => x.RecipeId == recipeId && x.RatingRecipe != null).Take(limit).ToListAsync();
                userReactions.ForEach(x => 
                {
                    var currentUser = userManager.FindByIdAsync(x.UserId.ToString()).Result;
                    x.FullName = currentUser.UserName;
                    x.AvatarUrl = currentUser.AvatarImageUrl;
                });
                return Ok(new
                {
                    success = true,
                    data = userReactions,
                    message = "Read all successfull"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Rating recipe exception"
                });
            }
        }
        [HttpPost("read-reaction")]
        public async Task<ActionResult> ReadReaction([FromQuery]int recipeId)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userIdStr = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                var userId = int.Parse(userIdStr);

                var existingUserReaction = await selfService.FirstOrDefaultAsync(x => x.UserId == userId && x.RecipeId == recipeId);

                return Ok(new
                {
                    success = true,
                    data = existingUserReaction,
                    message = "Rating recipe successfull"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Rating recipe exception"
                });
            }
        }
        [HttpGet("like")]
        [Authorize]
        public async Task<ActionResult> LikeRecipe([FromQuery]int recipeId)
        {
            try
            {
                // Lay ra user id tu Tokentry 

                var userIdStr = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                var userId = int.Parse(userIdStr);
                var result = await selfService.LikeRecipe(userId, recipeId);
                if (result != null)
                {
                    return Ok(result);
                } else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("view")]
        public async Task<ActionResult> ViewRecipe([FromQuery]int recipeId)
        {
            try
            {
                // Lay ra user id tu Tokentry 

                var userIdStr = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                var userId = int.Parse(userIdStr);
                var result = await selfService.ViewRecipe(userId, recipeId);
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("is-like")]
        [Authorize]
        public async Task<ActionResult> IsLikeRecipe([FromQuery]int recipeId)
        {
            try
            {
                // Lay ra user id tu Tokentry 
                var userIdStr = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                var userId = int.Parse(userIdStr);
                var result = await selfService.FirstOrDefaultAsync(x => x.UserId == userId && x.RecipeId == recipeId);
                if (result != null)
                {
                    if(result.IsLike.Value == true)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return NotFound();
                    }
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("get-like-share-count")]
        public async Task<ActionResult> GetLikeAndShareCount([FromQuery]int recipeId)
        {
            try
            {
                var like = await selfService.Get(x => x.RecipeId == recipeId && x.IsLike == true).ToListAsync();
                var share = await selfService.Get(x => x.RecipeId == recipeId && x.IsShare == true).ToListAsync();
                var comment = await selfService.CommentCount(recipeId);
                if (like != null)
                {
                    return Ok(new
                    {
                        success = true,
                        likeCount = like.Count(),
                        shareCount = share.Count(),
                        commentCount = comment
                    });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}