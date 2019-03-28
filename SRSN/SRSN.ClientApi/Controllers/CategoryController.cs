using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Services;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private ICategoryService categoryService;
        private IRecipeCategoryService recipeCategoryService;

        public CategoryController(ICategoryService categoryService, IRecipeCategoryService recipeCategoryService)
        {
            this.categoryService = categoryService;
            this.recipeCategoryService = recipeCategoryService;
        }

        [HttpGet("read-categoryitem")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadCategory(int categoryMainId)
        {
            return Ok( await categoryService.GetListCategoryItems(categoryMainId));
        }

        [HttpGet("read")]
        [AllowAnonymous]
        public ActionResult ReadCategory()
        {
            return Ok( categoryService.GetCategoryMain());
        }

        [HttpGet("read-categories-by-recipe")]
        [AllowAnonymous]
        public async Task<ActionResult> readCategoriesByRecipe(int recipeId)
        {
            return Ok(await recipeCategoryService.GetListRecipeCategory(recipeId));
        }
    }
}