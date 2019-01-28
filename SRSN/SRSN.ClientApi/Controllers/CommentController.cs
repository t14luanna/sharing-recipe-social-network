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
    public class CommentController : ControllerBase
    {
        private ICommentService commentService;
        public CommentController(ICommentService commentService)
        {
            this.commentService = commentService;
        }

        [HttpPost("createComment")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody]CommentViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = userId;
            request.CreateTime = DateTime.Now;
            await commentService.CreateAsync(request);
            return Ok(new
            {
                message = "Create comment successful"
            });
        }

        [HttpPut("updateComment")]
        [Authorize]
        public async Task<ActionResult> Update([FromBody]CommentViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = userId;
            request.UpdateTime = DateTime.Now;
            await commentService.UpdateAsync(request);
            return Ok(new
            {
                message = "Update comment successfull"
            });
        }

        [HttpDelete("deactivateComment")]
        [Authorize]
        public async Task<ActionResult> Delete(int Id)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            await commentService.DeActiveComment(Id);
            return Ok(new
            {
                message = "Deactivate comment successfull"
            });
        }

        [HttpGet("{postId}")]
        public ActionResult GetAllCommentByPostId(int postId)
        {
            return Ok(new
            {
                request = commentService.GetAllCommentByPostId(postId)
            });
         }
        

        [HttpGet("get-all")]
        public ActionResult GetAll()
        {
            return Ok(new {
                request = commentService.Get()
            });
        }
        
    }
}