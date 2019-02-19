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
    #region Controllers
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private IRecipeService recipeService;
        
        private UserManager<SRSNUser> userManager;

        public RecipeController(IRecipeService recipeService, UserManager<SRSNUser> userManager)
        {
            this.recipeService = recipeService ;
            this.userManager = userManager ;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody]RequestCreateRecipeWithConstraintViewMode request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.RecipeVM.UserId = userId;
            await recipeService.CreateRecipeWithSteps(request.RecipeVM, request.ListSORVM, request.listIngredient, request.listCategory);
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

        [HttpGet("read-popular")]
        public async Task<ActionResult> ReadPopular()
        {
            try
            {
                return Ok( recipeService.GetPopularRecipes(this.userManager));
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
                return Ok(recipeService.GetLatestRecipes(this.userManager));
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
                return Ok(recipeService.GetRelatedRecipe(userId ));
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
                return Ok(recipeService.Get1000LatestRecipes(this.userManager));
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
                return Ok(recipeService.GetRandomRecipes(this.userManager));
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
                return Ok(recipeService.GetRecipeWithID(this.userManager, recipeId));
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
    }
    #endregion
}