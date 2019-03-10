using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class UserReactionRecipe
    {
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public int? TotalView { get; set; }
        public double? RatingRecipe { get; set; }
        public double? Point { get; set; }
        public bool? IsView { get; set; }
        public bool? IsLike { get; set; }
        public bool? IsShare { get; set; }
        public double? CalculatedRating { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
