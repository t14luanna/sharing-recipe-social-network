using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class RecipeViewModel
    {
        public int Id { get; set; }
        public string ImageCover { get; set; }
        public DateTime? CreateTime { get; set; }
        public string UserId { get; set; }
        public string RecipeName { get; set; }
        public string VideoLink { get; set; }
        public int? LevelRecipe { get; set; }
        public int? CookTime { get; set; }
        public int? Serving { get; set; }
    }
}
