using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class RequestCreateRecipeWithConstraintViewMode
    {
        public RecipeViewModel RecipeVM { get; set; }
        public List<CategoryItemViewModel> ListSORVM { get; set; }
        public List<RecipeIngredientViewModel> listIngredient { get; set; }
        public List<RecipeCategoryViewModel> listCategory { get; set; }
    }

    public class RecipeViewModel
    {
        public int Id { get; set; }
        public string ContentRecipe { get; set; }
        public string ImageCover { get; set; }
        public DateTime? CreateTime { get; set; }
        public DateTime? UpdateTime { get; set; }
        public string UserId { get; set; }
        public string RecipeName { get; set; }
        public string VideoLink { get; set; }
        public int? LevelRecipe { get; set; }
        public int? CookTime { get; set; }
        public int? Serving { get; set; }
        public bool? Active { get; set; }
        public int? ViewQuantity { get; set; }
        public double EvRating { get; set; }
        public string FullName { get; set; }
        public string Avarta { get; set; }
        public List<CategoryItemViewModel> ListSORVM { get; set; }
        public List<RecipeIngredientViewModel> listIngredient { get; set; }
        public List<RecipeCategoryViewModel> listCategory { get; set; }
    }
}
