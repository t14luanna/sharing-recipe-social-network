using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class Comment
    {
        public Comment()
        {
            CommentLike = new HashSet<CommentLike>();
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public int? SharePostId { get; set; }
        public DateTime? CreateTime { get; set; }
        public string CommentContent { get; set; }
        public string ImageUrl { get; set; }

        public SharedPost SharePost { get; set; }
        public User UsernameNavigation { get; set; }
        public ICollection<CommentLike> CommentLike { get; set; }
    }
}
