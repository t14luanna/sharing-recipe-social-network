using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserBlock
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string BlockedUsername { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
