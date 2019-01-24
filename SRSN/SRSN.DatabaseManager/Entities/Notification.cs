using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class Notification
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string NotiContent { get; set; }
        public DateTime? CreateTime { get; set; }

        public virtual User UsernameNavigation { get; set; }
    }
}
