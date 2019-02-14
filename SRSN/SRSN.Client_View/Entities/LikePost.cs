using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class LikePost
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PostId { get; set; }

        public virtual Post Post { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
