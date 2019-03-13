using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class RatingRecipeViewModel
    {
        public int Id { get; set; }
        public double? Star { get; set; }
        public int? UserId { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? CreateTime { get; set; }
        public string ContentRating { get; set; }
        public string FullName { get; set; }
        public string AvatarUrl { get; set; }
    }
}
