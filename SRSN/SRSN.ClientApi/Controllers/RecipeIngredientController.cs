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
        
    }
}
