using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class AspNetUserLogins
    {
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
        public string ProviderDisplayName { get; set; }
        public int UserId { get; set; }

        public virtual AspNetUsersService User { get; set; }
    }
}
