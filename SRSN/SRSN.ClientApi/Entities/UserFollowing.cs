using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class UserFollowing
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FollowingUserId { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? Active { get; set; }

        public virtual AspNetUsers FollowingUser { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
