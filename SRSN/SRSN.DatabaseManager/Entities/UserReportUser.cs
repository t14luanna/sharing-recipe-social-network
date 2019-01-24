using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserReportUser
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string ReportedUsername { get; set; }
        public int? Description { get; set; }

        public virtual User ReportedUsernameNavigation { get; set; }
        public virtual User UsernameNavigation { get; set; }
    }
}
