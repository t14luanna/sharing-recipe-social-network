using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRSN.ClientApi.Models;

namespace SRSN.ClientApi.Controllers
{
    #region Controllers
    public interface IRecipeController
    {
        ActionResult Read();
        ActionResult Create([FromBody]Recipe request);
        ActionResult Update();
        ActionResult Delete();
    }

    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase, IRecipeController
    {
        private CookyDemoContext dbContext;

        /// <summary>
        /// Constructor cua controller Recipe
        /// Nhan vao 1 dbContext duoc new san o Startup.cs
        /// </summary>
        /// <param name="dbContext"></param>
        public RecipeController(CookyDemoContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <summary>
        /// Api Create
        /// </summary>
        /// <param name="request">Tham so dau vao la 1 class co kieu Recipe Entity</param>
        /// <returns></returns>
        [HttpPost("create")]
        public ActionResult Create([FromBody]Recipe request)
        {
            // goi db context ra
            dbContext
                // tro toi Recipe Table
                .Set<Recipe>()
                // them vao bang Recipe 1 entity Recipe co ten la request
                .Add(request);

            // Save lai context du lieu cap nhat duoi Database
            dbContext.SaveChanges();
            return Ok(new
            {
                message = $"Ban da tao thanh cong Recipe co ten la: {request.RecipeName}"
            });
        }

        public ActionResult Delete()
        {
            throw new NotImplementedException();
        }

        public ActionResult Read()
        {
            return Ok(dbContext.Set<Recipe>().ToList());
        }

        public ActionResult Update()
        {
            throw new NotImplementedException();
        }
    }

    #endregion
    #region View Models
    public class RecipeViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<IngredientViewModel> ListIngredients { get; set; }
    }

    public class IngredientViewModel
    {
        public string Name { get; set; }

    }

    #endregion
   
}