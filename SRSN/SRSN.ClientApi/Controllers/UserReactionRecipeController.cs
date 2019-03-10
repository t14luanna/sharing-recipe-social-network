using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserReactionRecipeController : ControllerBase
    {
        private IUserReactionRecipeService selfService;
        public UserReactionRecipeController(IUserReactionRecipeService selfService)
        {
            this.selfService = selfService;
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
    }
}