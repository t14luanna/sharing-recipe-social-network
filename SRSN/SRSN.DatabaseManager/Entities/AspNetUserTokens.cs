using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class AspNetUserTokens
    {
        public int UserId { get; set; }
        public string LoginProvider { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        public virtual AspNetUsersService User { get; set; }
    }
}
