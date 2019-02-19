using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.ClientApi.Controllers
{
    public class RecipeIngredientController: ControllerBase
    {
        private IRecipeIngredientService recipeIngredientService;

        public RecipeIngredientController(IRecipeIngredientService recipeIngredientService)
        {
            this.recipeIngredientService = recipeIngredientService;
        }
        [HttpGet("read-ingredients-of-recipe")]
        public async Task<ActionResult> ReadPopular([FromQuery]int recipeId)
        {
            try
            {
                return Ok(recipeIngredientService.GetRecipeIngredients(recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
