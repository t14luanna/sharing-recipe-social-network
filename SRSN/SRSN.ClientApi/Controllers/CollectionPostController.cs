using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollectionPostController : ControllerBase
    {
        private UserManager<SRSNUser> userManager;
        private ICollectionPostService collectionPostService;
        public CollectionPostController(UserManager<SRSNUser> userManager, ICollectionPostService collectionPostService)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.collectionPostService = collectionPostService;
        }
        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] CollectionPostViewModel request)
        {
            try
            {
                await collectionPostService.CreateAsync(request);


                return Ok(new
                {
                    message = $"Ban da tao thanh cong Bo Suu Tap co ten la: {request.CollectionId}"
                });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("get-recipes")]
        [AllowAnonymous]
        public async Task<ActionResult> GetRecipeByCollectionId( int collectionId)
        {
            try
            {
                return Ok (await collectionPostService.GetRecipeByCollectionId(this.userManager, collectionId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("delete-recipepost")]
      
        public async Task<ActionResult> DeativateRecipePost(int collectionId, int recipePostId )
        {
            try
            {
                await collectionPostService.DeactiveAsync(collectionId, recipePostId);
                return Ok(new { message = "Bạn đã xóa thàng công công thức nấu ăn!"});
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}