using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class CommentLike
    {
        public int Id { get; set; }
        public int CommentId { get; set; }
        public int UserId { get; set; }

        public virtual Comment Comment { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
