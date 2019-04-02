using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class UserReportUserViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public int ReportedUserId { get; set; }
        public string ReportedUsername { get; set; }
        public string Description { get; set; }
        public Boolean Active{ get; set; }
        public DateTime? CreateTime { get; set; }
    }
}
