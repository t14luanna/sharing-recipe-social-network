﻿using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class UserReportUser
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ReportedUserId { get; set; }
        public string Description { get; set; }
        public DateTime? CreateTime { get; set; }

        public virtual AspNetUsers ReportedUser { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
