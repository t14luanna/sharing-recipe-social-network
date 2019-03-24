using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class UserReactionRecipeViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public int? TotalView { get; set; }
        public DateTime? RatingTime { get; set; }
        public double? RatingRecipe { get; set; }
        public string RatingContent { get; set; }
        public double? Point { get; set; }
        public bool? IsView { get; set; }
        public bool? IsLike { get; set; }
        public bool? IsShare { get; set; }
        public double? CalculatedRating { get; set; }
        public string FullName { get; set; }
        public string AvatarUrl { get; set; }
        public int? TotalShare { get; set; }

    }
}
