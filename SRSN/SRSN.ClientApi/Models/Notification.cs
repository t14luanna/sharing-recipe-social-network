using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class Notification
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string NotiContent { get; set; }
        public DateTime? CreateTime { get; set; }

        public User UsernameNavigation { get; set; }
    }
}
