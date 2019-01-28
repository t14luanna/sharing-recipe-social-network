using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class Comment
    {
        public Comment()
        {
            CommentLike = new HashSet<CommentLike>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public int? SharePostId { get; set; }
        public DateTime? CreateTime { get; set; }
        public string CommentContent { get; set; }
        public string ImageUrl { get; set; }
        public int? CommentParentId { get; set; }

        public virtual Post SharePost { get; set; }
        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<CommentLike> CommentLike { get; set; }
    }
}
