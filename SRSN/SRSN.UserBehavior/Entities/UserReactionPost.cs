using System;
using System.Collections.Generic;

namespace SRSN.UserBehavior.Entities
{
    public partial class UserReactionPost
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PostId { get; set; }
        public bool? IsLike { get; set; }

        public virtual Post Post { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
