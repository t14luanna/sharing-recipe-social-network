using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserBlockController : ControllerBase
    {
        private IUserBlockService userBlockService;
        private UserManager<SRSNUser> userManager;
        private IMapper mapper;
        public UserBlockController(IUserBlockService userBlockService, UserManager<SRSNUser> userManager, IMapper mapper)
        {
            this.userBlockService = userBlockService;
            this.userManager = userManager;
            this.mapper = mapper;
        }
  
        [HttpPost("block")]
        [Authorize]
        public async Task<ActionResult> BlockAccount([FromBody]UserBlockViewModel userBlockVM)
        {
            var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
            userBlockVM.UserId = int.Parse(userId);
            await userBlockService.CreateAsync(userBlockVM);
            return Ok(new {
                message = "Bạn đã block thanh cong"
            });
        }

        [HttpGet("get")]
        [Authorize]
        public async Task<ActionResult> GetBlockedAccount()
        {
            var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
            var listUserBlockVM = userBlockService.Get(u => u.UserId == int.Parse(userId)).ToList();
            foreach (var userBlockVM in listUserBlockVM)
            {
                var blockedUser = await userManager.FindByIdAsync(userBlockVM.BlockedUserId.ToString());
                var blockedUserVM = new AccountEditViewModel();
                mapper.Map(blockedUser, blockedUserVM);
                userBlockVM.BlockedUserVM = blockedUserVM;
            }

            return Ok(listUserBlockVM); 
        }

    }
}
