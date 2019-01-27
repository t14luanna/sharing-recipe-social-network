using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        /// <summary> 
        /// Constructor cua controller Recipe
        /// Nhan vao 1 dbContext duoc new san o Startup.cs
        /// </summary>
        /// <param name="dbContext"></param>
        public RecipeController(IRecipeService recipeService)
        {
            this.recipeService = recipeService;
        }

        /// <summary>
        /// Api Create
        /// </summary>
        /// <param name="request">Tham so dau vao la 1 class co kieu Recipe Entity</param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody]RecipeViewModel request)
        {
            // goi db context ra
            // Save lai context du lieu cap nhat duoi Database
            await recipeService.CreateAsync(request);
            return Ok(new
            {
                message = $"Ban da tao thanh cong Recipe co ten la: {request.RecipeName}"
            });
        }

        public ActionResult Delete()
        {
            throw new NotImplementedException();
        }

        [HttpGet("read")]
        public ActionResult Read()
        {
            return Ok(recipeService.Get());
        }

        public ActionResult Update()
        {
            throw new NotImplementedException();
        }
    }

    #endregion
}