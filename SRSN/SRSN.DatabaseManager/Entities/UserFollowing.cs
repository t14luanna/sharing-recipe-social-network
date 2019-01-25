﻿using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserFollowing
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string FollowingUserId { get; set; }

        public virtual AspNetUsers FollowingUser { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
