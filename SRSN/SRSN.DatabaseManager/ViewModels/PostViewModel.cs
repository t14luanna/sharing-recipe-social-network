using System;

namespace SRSN.DatabaseManager.ViewModels
{
    public class PostViewModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
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
    }
}
