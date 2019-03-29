using System;
using System.Collections.Generic;

namespace SRSN.Admin.Entities
{
    public partial class Notification
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string NotiContent { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? IsRead { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
