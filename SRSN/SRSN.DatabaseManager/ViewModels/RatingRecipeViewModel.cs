using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class RatingRecipeViewModel
    {
        public int Id { get; set; }
        public int? Star { get; set; }
        public string UserId { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUr { get; set; }
    }
}
