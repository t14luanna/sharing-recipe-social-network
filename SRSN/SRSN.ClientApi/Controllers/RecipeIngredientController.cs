using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeIngredientController: ControllerBase
    {
        private IRecipeIngredientService recipeIngredientService;

        public RecipeIngredientController(IRecipeIngredientService recipeIngredientService)
        {
            this.recipeIngredientService = recipeIngredientService;
        }
        
        [HttpGet("get-recipe-ingredients")]
        public async Task<ActionResult> readRecipeIngredients(int recipeId)
        {
            try
            {
                return Ok(await recipeIngredientService.GetRecipeIngredients(recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

    }
}
