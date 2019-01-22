using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class UserBlock
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string BlockedUsername { get; set; }

        public User BlockedUsernameNavigation { get; set; }
        public User UsernameNavigation { get; set; }
    }
}
