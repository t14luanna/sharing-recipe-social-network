using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserFollowing
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FollowingUser { get; set; }

        public virtual User FollowingUserNavigation { get; set; }
        public virtual User UsernameNavigation { get; set; }
    }
}
