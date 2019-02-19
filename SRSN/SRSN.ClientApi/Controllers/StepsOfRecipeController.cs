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
    public class StepsOfRecipeController: ControllerBase
    {
        private IStepsOfRecipeService stepsOfRecipeService;

        public StepsOfRecipeController(IStepsOfRecipeService stepsOfRecipeService)
        {
            this.stepsOfRecipeService = stepsOfRecipeService ;
        }
        [HttpGet("read-steps")]
        public async Task<ActionResult> ReadStepsRecipe(int recipeId)
        {
            try
            {
                return Ok(await stepsOfRecipeService.GetStepsOfRecipe(recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
