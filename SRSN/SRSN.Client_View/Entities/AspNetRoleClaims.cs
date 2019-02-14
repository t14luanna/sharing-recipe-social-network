using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class AspNetRoleClaims
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }

        public virtual AspNetRoles Role { get; set; }
    }
}
