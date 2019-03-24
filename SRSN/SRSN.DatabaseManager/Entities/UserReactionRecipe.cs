using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserReactionRecipe
    {
        public UserReactionRecipe()
        {
            Comment = new HashSet<Comment>();
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public DateTime? RatingTime { get; set; }
        public double? RatingRecipe { get; set; }
        public string RatingContent { get; set; }
        public double? Point { get; set; }
        public bool? IsView { get; set; }
        public bool? IsLike { get; set; }
        public bool? IsShare { get; set; }
        public double? CalculatedRating { get; set; }
        public int? TotalView { get; set; }
        public int? TotalShare { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<Comment> Comment { get; set; }
    }
}
