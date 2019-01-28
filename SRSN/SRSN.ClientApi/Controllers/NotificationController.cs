using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SRSN.DatabaseManager.Services;
using System;
using System.Collections.Generic;
using System.Linq;
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
        [AllowAnonymous]
        public  ActionResult ReadNotificationByUsername(string userId)
        {
            return Ok(notificationService.Get(u => u.UserId.Equals(userId)));
        }
    }
}
