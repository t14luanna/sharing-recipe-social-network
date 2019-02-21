using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {

        private ICategoryService categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            this.categoryService = categoryService;
        }
        [HttpGet("read-categoryitem")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadCategory(int categoryMainId)
        {
            return Ok( await categoryService.GetListCategoryItems(categoryMainId));
        }
    }
}