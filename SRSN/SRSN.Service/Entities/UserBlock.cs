using System;
using System.Collections.Generic;

namespace SRSN.Service.Entities
{
    public partial class UserBlock
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string BlockedUserId { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
