using SRSN.DatabaseManager.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class UserFollowingViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FollowingUserId { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? Active { get; set; }

        public List<AspNetUsers> ListFollowingUser { get; set; }
       
    }
}
