using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class Accounts
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int? RoleId { get; set; }

        public Role Role { get; set; }
        public User User { get; set; }
    }
}
