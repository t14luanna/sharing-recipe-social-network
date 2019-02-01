using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class AspNetUserClaims
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }

        public virtual AspNetUsersService User { get; set; }
    }
}
