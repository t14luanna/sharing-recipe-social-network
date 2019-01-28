using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class UserReportUser
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ReportedUserId { get; set; }
        public int? Description { get; set; }
        public DateTime? CreateTime { get; set; }

        public virtual AspNetUsers ReportedUser { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
