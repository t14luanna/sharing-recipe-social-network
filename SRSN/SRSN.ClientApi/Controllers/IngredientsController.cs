using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientsController : ControllerBase
    {
        private IIngredientsService ingredientsService;
        /// <summary>
        /// Constructor cua controller Recipe
        /// Nhan vao 1 dbContext duoc new san o Startup.cs
        /// </summary>
        /// <param name="dbContext"></param>
        public IngredientsController(IIngredientsService collectionService)
        {
            this.ingredientsService = collectionService;
        }

        [HttpGet("read")]
        public ActionResult Get([FromQuery] string ingredientName)
        {
            var result = ingredientsService.Get(p => p.Name.Contains(ingredientName, StringComparison.CurrentCultureIgnoreCase));
            return Ok(result);
        }

        [HttpGet("read-stores")]
        public ActionResult GetStoreInformationByIngredientName([FromQuery] string ingredientName)
        {
            var result = ingredientsService.GetListStoreByIngredientName(ingredientName);
            return Ok(result);
        }

    }
}