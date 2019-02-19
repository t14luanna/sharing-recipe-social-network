using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class UserBlock
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BlockedUserId { get; set; }

        public virtual AspNetUsers BlockedUser { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
