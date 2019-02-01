using SRSN.DatabaseManager.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class NotificationViewModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string NotiContent { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? IsRead { get; set; }
        
    }
}
