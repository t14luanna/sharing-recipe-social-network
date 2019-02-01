using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class AspNetUserRoles
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }

        public virtual AspNetRoles Role { get; set; }
        public virtual AspNetUsersService User { get; set; }
    }
}
