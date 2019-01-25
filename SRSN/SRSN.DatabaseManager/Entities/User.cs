using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class User
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Description { get; set; }
        public string Birthdate { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual Accounts UsernameNavigation { get; set; }
    }
}
