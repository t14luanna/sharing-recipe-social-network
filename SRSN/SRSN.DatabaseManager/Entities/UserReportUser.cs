using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserReportUser
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ReportedUserId { get; set; }
        public int? Description { get; set; }
        public DateTime? CreateTime { get; set; }

        public virtual AspNetUsersService ReportedUser { get; set; }
        public virtual AspNetUsersService User { get; set; }
    }
}
