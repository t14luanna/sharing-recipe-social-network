using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class LikePost
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PostId { get; set; }

        public virtual Post Post { get; set; }
        public virtual AspNetUsersService User { get; set; }
    }
}
