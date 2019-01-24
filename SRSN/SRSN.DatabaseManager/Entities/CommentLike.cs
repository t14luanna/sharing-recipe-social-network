using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class CommentLike
    {
        public int? Id { get; set; }
        public int CommentId { get; set; }
        public string Username { get; set; }

        public virtual Comment Comment { get; set; }
        public virtual User UsernameNavigation { get; set; }
    }
}
