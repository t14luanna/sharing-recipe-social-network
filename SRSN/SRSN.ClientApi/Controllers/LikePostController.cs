using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikePostController : ControllerBase
    {
        private IUserReactionPostService likePostService;
        public LikePostController(IUserReactionPostService likePostService)
        {
            this.likePostService = likePostService;
        }

        

        [HttpPost("like")]
        [Authorize]
        public async Task<ActionResult> LikePost([FromBody]UserReactionViewModel likePostViewModel)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                likePostViewModel.UserId = int.Parse(userId);
                var existedUser = await likePostService.FirstOrDefaultAsync(p => p.PostId == likePostViewModel.PostId && p.UserId == likePostViewModel.UserId);
                if(existedUser.Id != 0)
                {
                    return Ok(new
                    {
                        status = 5,
                        message = "Ban like khong thanh cong vi Duplicate"
                    });
                }

                await likePostService.CreateAsync(likePostViewModel);
                return Ok(new
                {
                    message = "Bạn đã LIKE thanh cong"
                });
            } catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpDelete("unlike")]
        [Authorize]
        public async Task<ActionResult> UnLikePost([FromBody]UserReactionViewModel likePostViewModel)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                likePostViewModel.UserId = int.Parse(userId);
                var existedLikePost = await likePostService.FirstOrDefaultAsync(p => p.PostId == likePostViewModel.PostId && p.UserId == likePostViewModel.UserId);
                if (existedLikePost.Id == 0)
                {
                    return Ok(new
                    {
                        message = "Ban unlike khong thanh cong"
                    });
                }
                await likePostService.DeleteAsync(existedLikePost);
                return Ok(new
                {
                    message = "Bạn đã unlike thanh cong"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpGet("get")]
        public async Task<ActionResult> GetAllLikeOfPost(int postId)
        {
            return Ok(likePostService.Get(u => u.PostId.Equals(postId)));
        }
    }
}