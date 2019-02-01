﻿using System;
using System.Collections.Generic;

namespace SRSN.Service.Entities
{
    public partial class Notification
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string NotiContent { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? IsRead { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}