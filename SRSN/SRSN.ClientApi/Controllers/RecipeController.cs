using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Redis;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;
using StackExchange.Redis;

namespace SRSN.ClientApi.Controllers
{
    #region Controllers
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private string userRecipeRecommendPrefix = "RCS_User_";

        private IRecipeService recipeService;
        private UserManager<SRSNUser> userManager;
        private IDatabase redisDatabase;
        public RecipeController(IRecipeService recipeService, UserManager<SRSNUser> userManager)
        {
            this.recipeService = recipeService ;
            this.userManager = userManager ;
            this.redisDatabase = RedisUtil.Connection.GetDatabase();
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody]RequestCreateRecipeWithConstraintViewMode request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.RecipeVM.UserId = userId;
            await recipeService.CreateRecipeWithStepsAsync(request.RecipeVM, request.ListSORVM, request.listIngredient, request.listCategory);
            return Ok(new
            {
                message = $"Ban da tao thanh cong Recipe co ten la: {request.RecipeVM.RecipeName}"
            });
        }
        [HttpDelete("delete")]
        [Authorize]
        public async Task<ActionResult> Delete(int recipeId)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            await recipeService.DeActiveRecipe(recipeId);
            return Ok(new
            {
                message = $"Ban da xoa thanh cong Recipe co ten la: {recipeId}"
            });
        }

        [HttpGet("read")]
        public async Task<ActionResult> Read(int userId)
        {
            try
            {
                return Ok(await recipeService.GetAllRecipeByUserId(userId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-ingredients")]
        public async Task<ActionResult> ReadIngredients(int recipeId)
        {
            try
            {
                return Ok(await recipeService.GetAllIngredientByRecipeId(recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("read-popular")]
        public async Task<ActionResult> ReadPopular()
        {
            try
            {
                return Ok(await recipeService.GetPopularRecipes(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        
        [HttpGet("read-latest")]
        public async Task<ActionResult> ReadLatest()
        {
            try
            {
                return Ok( await recipeService.GetLatestRecipes(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-related-recipe")]
        public async Task<ActionResult> ReadRelatedRecipe([FromQuery]int userId)
        {
            try
            {
                return Ok(await recipeService.GetRelatedRecipe(userId ));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("read-recommend-recipes")]
        public async Task<ActionResult> ReadRecommendRecipes([FromQuery]int userId)
        {
            try
            {
                var key = $"{userRecipeRecommendPrefix}{userId}";
                var datas = await redisDatabase.SortedSetRangeByScoreWithScoresAsync(key);
                var listRecipe = new List<RecipeViewModel>();
                foreach (var data in datas)
                {
                    int recipeId = 0;
                    int.TryParse(data.Element, out recipeId);
                    var recipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId);
                    listRecipe.Add(recipe);
                }
                return Ok(listRecipe);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-latest-page")]
        public async Task<ActionResult> Read1000Latest()
        {
            try
            {
                return Ok(await recipeService.Get1000LatestRecipes(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("read-random")]
        public async Task<ActionResult> ReadRandom()
        {
            try
            {
                return Ok( await recipeService.GetRandomRecipes(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-recipeid")]
        public async Task<ActionResult> ReadRecipeWithId(int recipeId)
        {
            try
            {
                return Ok(await recipeService.GetRecipeWithID(this.userManager, recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-lastest")]
        public async Task<ActionResult> ReadLastest()
        {
            try
            {
                return Ok(recipeService.GetLastestRecipes());
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("update")]
        [Authorize]
        public async Task<ActionResult> Update([FromBody]RequestCreateRecipeWithConstraintViewMode request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.RecipeVM.UserId = userId;
            await recipeService.UpdateRecipe(request.RecipeVM, request.ListSORVM, request.listIngredient, request.listCategory);
            return Ok(new
            {
                message = $"Ban da update thanh cong Recipe co ten la: {request.RecipeVM.RecipeName}"
            });
        }

        [HttpPost("submit-recipe")]
        public async Task<ActionResult> SubmitRecipe([FromBody]RecipeSubmitViewModel request)
        {
            try
            {
                 ClaimsPrincipal claims = this.User;
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                request.UserId = userId;
                await recipeService.SubmitRecipeWithStepsAsync(request);
                return Ok(new
                {
                    status = true,
                    message = $"Ban da tao thanh cong Recipe"
                });
            } catch(Exception ex)
            {
                return Ok(new
                {
                    status = false,
                    message = $"Ban tao recipe that bai",
                    error = ex.ToString()
                });
            }
        }
    }
    #endregion
}