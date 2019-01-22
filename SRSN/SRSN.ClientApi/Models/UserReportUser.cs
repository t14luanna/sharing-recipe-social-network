using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class UserReportUser
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string ReportedUsername { get; set; }
        public int? Description { get; set; }

        public User ReportedUsernameNavigation { get; set; }
        public User UsernameNavigation { get; set; }
    }
}
