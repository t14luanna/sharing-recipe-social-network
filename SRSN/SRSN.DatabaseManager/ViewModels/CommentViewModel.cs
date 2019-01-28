using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class CommentViewModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int? PostId { get; set; }
        public DateTime? CreateTime { get; set; }
        public string CommentContent { get; set; }
        public string ImageUrl { get; set; }
        public int? ParentId { get; set; }
        public bool? Active { get; set; }
        public DateTime? UpdateTime { get; set; }
    }
}
