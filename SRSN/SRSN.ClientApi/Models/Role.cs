using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class Role
    {
        public Role()
        {
            Accounts = new HashSet<Accounts>();
        }

        public int Id { get; set; }
        public string RoleName { get; set; }

        public ICollection<Accounts> Accounts { get; set; }
    }
}
