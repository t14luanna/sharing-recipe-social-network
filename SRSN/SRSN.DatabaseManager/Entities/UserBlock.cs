using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserBlock
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string BlockedUsername { get; set; }

        public virtual User BlockedUsernameNavigation { get; set; }
        public virtual User UsernameNavigation { get; set; }
    }
}
