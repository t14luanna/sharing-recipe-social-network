using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class CommentLike
    {
        public int? Id { get; set; }
        public int CommentId { get; set; }
        public string Username { get; set; }

        public Comment Comment { get; set; }
        public User UsernameNavigation { get; set; }
    }
}
