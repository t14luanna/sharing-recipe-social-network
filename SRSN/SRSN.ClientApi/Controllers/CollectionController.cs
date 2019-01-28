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
    public class CollectionController : ControllerBase
    {
        private ICollectionService collectionService;
        /// <summary>
        /// Constructor cua controller Recipe
        /// Nhan vao 1 dbContext duoc new san o Startup.cs
        /// </summary>
        /// <param name="dbContext"></param>
        public CollectionController(ICollectionService collectionService)
        {
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
            // goi db context ra
            // Save lai context du lieu cap nhat duoi Database
            await collectionService.CreateAsync(request);
            return Ok(new
            {
                message = $"Ban da tao thanh cong Bo Suu Tap co ten la: {request.CollectionName}"
            });
        }
        [HttpGet("delete")]
        public async Task<ActionResult> Delete([FromBody] CollectionViewModel request)
        {
            await collectionService.DeleteAsync(request);
            return Ok(new
            {
                message = $"Ban xoa thanh con Bo Suu Tap: {request.CollectionName}"
            });
        }

        [HttpGet("read")]
        public ActionResult ReadByUserName(string UserId)
        {
            return Ok(collectionService.Get(u => u.UserId.Equals(UserId)));
        }

        [HttpGet("update")]
        public async Task<ActionResult> Update([FromBody] CollectionViewModel request)
        {
            await collectionService.UpdateAsync(request);
            return Ok(new
            {
                message = $"Ban da sua thanh cong Bo Suu Tap:{request.CollectionName} "
            });
        }
    }
}