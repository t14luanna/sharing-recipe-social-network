using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
    public class CommentController : ControllerBase
    {
        private UserManager<SRSNUser> userManager;
        private ICommentService commentService;
        public CommentController(UserManager<SRSNUser> userManager, ICommentService commentService)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.commentService = commentService;
        }

        [HttpPost("createComment")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody]CommentViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = int.Parse(userId);
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
            var existedComment = await commentService.FirstOrDefaultAsync(p => p.Id == request.Id);
            if(existedComment == null)
            {
                return Ok(new
                {
                    message = "Could not find the matched item.",
                    status = 404
                });
            }

            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = int.Parse(userId);
            // choose the vietnam datetime exactly
            request.UpdateTime = DateTime.UtcNow.AddHours(7);
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

        [HttpGet("getCommentByPost")]
        public ActionResult GetAllCommentByPostId(int postId)
        {
            return Ok(commentService.Get(p => p.PostId == postId && p.Active == true));
         }

        [HttpGet("get-all")]
        public ActionResult GetAll()
        {
            return Ok(new {
                request = commentService.Get(p => p.Active == true)
            });
        }
        [HttpGet("get-comment-by-parent-comment")]
        public async Task<ActionResult> GetAllCommentByParentCommentId(int recipeId, int recipeParentId)
        {
            try
            {
                return Ok(await commentService.GetAllCommentByParentCommentId(this.userManager, recipeId, recipeParentId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("get-count-reply-comment")]
        public ActionResult GetCountReplyComment(int recipeId, int recipeParentId)
        {
            return Ok(commentService.Get(p => p.RecipeId == recipeId && p.RecipeCommentParentId == recipeParentId && p.Active == true).Count());
        }

        [HttpGet("get-comment-by-recipeId")]
        public ActionResult GetAllCommentByRecipeId(int recipeId)
        {
            return Ok(commentService.GetAllCommentByRecipeId(this.userManager, recipeId));
        }
        

    }
}