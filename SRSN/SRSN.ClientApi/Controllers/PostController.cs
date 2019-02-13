using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private IPostService postService;
        public PostController(IPostService postService)
        {
            this.postService = postService;
        }

        [HttpPost("create")]
        
        public async Task<ActionResult> Create([FromBody]PostViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = userId;
            await postService.CreateAsync(request);
            return Ok(new {
                message = "Create new post successfully"
            });
        }

        [HttpPut("update")]
        [Authorize]
        public async Task<ActionResult> Update([FromBody]PostViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = userId;
            request.UpdateTime = DateTime.UtcNow.AddHours(7);
            await postService.UpdateAsync(request);
            return Ok(new {
                message = "Update post successfully"
            });
        }

        [HttpDelete("deactivate")]
        [Authorize]
        public async Task<ActionResult> Delete(int postId)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            await postService.DeActivatePost(postId);
            return Ok(new{
                message = "Deactivate post successfully"
            });
        }

        [HttpGet("get-post-by-userid")]
        public ActionResult GetAllPostByUserId(int userId)
        {
            return Ok(postService.Get(u => u.UserId == userId));
        }
    }

    
}