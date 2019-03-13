using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class Post
    {
        public Post()
        {
            Comment = new HashSet<Comment>();
            UserReactionPost = new HashSet<UserReactionPost>();
        }

        public int Id { get; set; }
        public int? UserId { get; set; }
        public double? Price { get; set; }
        public string ImageUrl { get; set; }
        public int? LevelRecipe { get; set; }
        public int? Serving { get; set; }
        public int? RecipeId { get; set; }
        public string ContentPost { get; set; }
        public string VideoUrl { get; set; }
        public DateTime? CreateTime { get; set; }
        public DateTime? UpdateTime { get; set; }
        public bool? Active { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<Comment> Comment { get; set; }
        public virtual ICollection<UserReactionPost> UserReactionPost { get; set; }
    }
}
