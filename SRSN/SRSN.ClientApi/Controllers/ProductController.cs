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
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private IProductService productService;
        public ProductController(IProductService productService)
        {
            this.productService = productService;
        }
        [HttpGet("read-by-ingredient-name")]
        public ActionResult ReadByIngredientName([FromQuery]string name)
        {
            try
            {
                var listProduct = productService
                    .Get(x => x.Name != null && x.Name.Contains(name, StringComparison.CurrentCultureIgnoreCase))
                    .ToList();
                return Ok(listProduct);
            }catch(Exception ex)
            {
                return Ok(new List<ProductViewModel>());
            }
        }
        [HttpGet("read-nearby-store")]
        public ActionResult ReadNearByStore([FromQuery]string ingredientName, [FromQuery] double userLat, [FromQuery] double userLong)
        {
            try
            {
                var listStore = productService.GetListStoreByProductID(ingredientName, userLat, userLong);
                return Ok(listStore);
            }
            catch (Exception ex)
            {
                return Ok(new List<ProductViewModel>());
            }
        }
    }

}