using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class Role
    {
        public Role()
        {
            Accounts = new HashSet<Accounts>();
        }

        public int Id { get; set; }
        public string RoleName { get; set; }

        public virtual ICollection<Accounts> Accounts { get; set; }
    }
}
