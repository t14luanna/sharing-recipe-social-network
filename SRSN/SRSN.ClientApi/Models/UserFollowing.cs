using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class UserFollowing
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FollowingUser { get; set; }

        public User FollowingUserNavigation { get; set; }
        public User UsernameNavigation { get; set; }
    }
}
