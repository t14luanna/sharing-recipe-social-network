using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SRSN.ClientApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private INotificationService notificationService;

        public NotificationController (INotificationService notificationService)
        {
            this.notificationService = notificationService;
        }
        [HttpGet("read")]
        [Authorize]
        public async Task<ActionResult> ReadNotificationByUserId()
        {
            var userId = User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier).Value;
            return Ok(notificationService.Get(u => u.UserId == int.Parse(userId)));
        }
    }
}
