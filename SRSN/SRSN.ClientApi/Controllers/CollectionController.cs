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
    [Authorize]
    public class CollectionController : ControllerBase
    {
        private UserManager<SRSNUser> userManager;
        private ICollectionService collectionService;
        /// <summary>
        /// Constructor cua controller Recipe
        /// Nhan vao 1 dbContext duoc new san o Startup.cs
        /// </summary>
        /// <param name="dbContext"></param>
        public CollectionController(UserManager<SRSNUser> userManager, ICollectionService collectionService)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.collectionService = collectionService;
        }
        /// <summary>
        /// Api Create
        /// </summary>
        /// <param name="request">Tham so dau vao la 1 class co kieu Collection Entity</param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody] CollectionViewModel request)
        {
            var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
            request.UserId = userId;
            var existed = collectionService.Get(u => u.CollectionRefId == request.CollectionRefId 
            && request.UserId == userId && u.Active == false).FirstOrDefault();
            if (request.CollectionRefId != null)
            {
                var collection = collectionService.Get(u => u.Id == request.CollectionRefId && u.Active == true).FirstOrDefault();
                collection.SaveCount += 1;
                await collectionService.UpdateAsync(collection);
            }
            if (existed != null)
            {
                existed.Active = true;
                await collectionService.UpdateAsync(existed);
            }
            else
            {
                await collectionService.CreateAsync(request);
            }
            return Ok(new
            {
                message = $"Ban da tao thanh cong Bo Suu Tap co ten la: {request.CollectionName}"
            });
        }
        [HttpDelete("delete")]
        public async Task<ActionResult> Delete([FromBody] CollectionViewModel request)
        {
            await collectionService.DeactiveAsync(request.Id);
            return Ok(new
            {
                message = $"Ban xoa thanh con Bo Suu Tap: {request.CollectionName}"
            });
        }
        [HttpGet("count-collections")]
        [AllowAnonymous]
        public async Task<ActionResult> CountCollections(string username)
        {
            var user = await this.userManager.FindByNameAsync(username);
            int userId = user.Id;
            int count = collectionService.Get(p => p.UserId == userId && p.Active == true).ToList().Count;
            return Ok(new { count = count });
        }
        [HttpGet("read-by-Id")]
        [AllowAnonymous]    
        public async Task<ActionResult> ReadByCollectionId(int collectionId)
        {
            try
            {
                return Ok(await collectionService.GetCollectionById(this.userManager, collectionId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-top-collection")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadTopPopularCollection()
        {
            try
            {
                return Ok(await collectionService.GetTopCollection(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpPut("update")]
        public async Task<ActionResult> Update([FromBody] CollectionViewModel request)
        {
            await collectionService.UpdateAsync(request);
            return Ok(new
            {
                message = $"Ban da sua thanh cong Bo Suu Tap:{request.CollectionName} "
            });
        }
        [HttpGet("is-saved-collection")]
        public async Task<ActionResult> IsSavedCollection(int userId, int collectionId)
        {
            var issaved = collectionService.Get(q => q.CollectionRefId == collectionId && q.UserId == userId && q.Active == true).Count();
            if(issaved > 0)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }
        [HttpPost("un-saved-collection")]
        [Authorize]
        public async Task<ActionResult> UnSavedCollection(int userId, int collectionId)
        {
            var issaved = collectionService.Get(q => q.CollectionRefId == collectionId && q.UserId == userId).FirstOrDefault();
            if (issaved != null)
            {
                issaved.Active = false;
                await collectionService.UpdateAsync(issaved);
                return Ok(new
                {
                    message = $"Bỏ lưu bộ sưu tập thành công"
                });
            }
            else
            {
                return NotFound();
            }
        }
        [HttpGet("read-by-userName")]
        [AllowAnonymous]
        public ActionResult ReadByUserName(string userName, int limit, int page)
        {
            ClaimsPrincipal claims = this.User;
            var userTokenName = claims.FindFirst(ClaimTypes.Name).Value;
            if (userTokenName.Equals(userName))
            {
                var collectionReturnList = new List<CollectionViewModel>();
                var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                var collectionList = collectionService.Get(u => u.UserId == int.Parse(userId) && u.Active == true);
                collectionList = collectionList.Skip(page * limit).Take(limit);
                foreach ( var item in collectionList)
                {
                    if(item.CollectionRefId != null)
                    {
                        var itemCol = collectionService.Get(u => u.Id == item.CollectionRefId && u.Active == true).FirstOrDefault();
                        collectionReturnList.Add(itemCol);
                    }
                    else
                    {
                        collectionReturnList.Add(item);
                    }
                    
                }

                return Ok(collectionReturnList);
            }
            else
            {
                var user = this.userManager.FindByNameAsync(userName).Result;
                var collectionList = collectionService.Get(u => u.UserId == user.Id && u.Active == true);
                collectionList = collectionList.Skip(page * limit).Take(limit);
                var collectionReturnList = new List<CollectionViewModel>();
                foreach (var item in collectionList)
                {
                    if (item.CollectionRefId != null)
                    {
                        var itemCol = collectionService.Get(u => u.Id == item.CollectionRefId && u.Active == true).FirstOrDefault();
                        collectionReturnList.Add(itemCol);
                    }
                    else
                    {
                        collectionReturnList.Add(item);
                    }

                }
                return Ok(collectionReturnList);
            }
        }

        private object List<T>()
        {
            throw new NotImplementedException();
        }

        [HttpGet("read")]
        [AllowAnonymous]
        public async Task<ActionResult> ReadByToken()
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userTokenName = claims.FindFirst(ClaimTypes.Name).Value;
                var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
                return Ok(collectionService.Get(u => u.UserId == int.Parse(userId) && u.Active == true && u.CollectionRefId == null));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}