using System;
using System.Collections.Generic;

namespace SRSN.Service.Entities
{
    public partial class Comment
    {
        public Comment()
        {
            CommentLike = new HashSet<CommentLike>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public int? PostId { get; set; }
        public DateTime? CreateTime { get; set; }
        public string CommentContent { get; set; }
        public string ImageUrl { get; set; }
        public int? ParentId { get; set; }
        public bool? Active { get; set; }
        public DateTime? UpdateTime { get; set; }

        public virtual Post Post { get; set; }
        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<CommentLike> CommentLike { get; set; }
    }
}
