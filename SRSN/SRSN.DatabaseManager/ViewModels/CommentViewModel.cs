using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class CommentViewModel
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PostId { get; set; }
        public DateTime? CreateTime { get; set; }
        public DateTime? UpdateTime { get; set; }
        public string CommentContent { get; set; }
        public string ImageUrl { get; set; }
        public int? CommentParentId { get; set; }
        public bool? Active { get; set; }
        public int? RecipeCommentParentId { get; set; }
        public int? RecipeId { get; set; }
        public string FullName { get; set; }
        public string FullNameOwnerComment { get; set; }
        public string UsernameOwnerComment { get; set; }
        public string Username { get; set; }
        public string AvatarUrl { get; set; }
    }
}
