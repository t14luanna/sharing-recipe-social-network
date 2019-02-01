using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserBlock
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BlockedUserId { get; set; }

        public virtual AspNetUsersService BlockedUser { get; set; }
        public virtual AspNetUsersService User { get; set; }
    }
}
