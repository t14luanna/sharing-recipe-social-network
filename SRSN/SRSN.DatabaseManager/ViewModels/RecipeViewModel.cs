using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class RequestCreateRecipeWithConstraintViewMode
    {
        public RecipeViewModel RecipeVM { get; set; }
        public List<StepsOfRecipeViewModel> ListSORVM { get; set; }
        public List<RecipeIngredientViewModel> ListIngredient { get; set; }
        public List<RecipeCategoryViewModel> ListCategory { get; set; }
    }

    public class RequestSubmitRecipeModel
    {
        public String ImageCover { get; set; }
        public String ContentRecipe { get; set; }
        public String RecipeName { get; set; }
        public int Serving { get; set; }
        public int Cooktime { get; set; }
        public int LevelRecipe { get; set; }
        public int UserId { get; set; }
        public String VideoLink { get; set; }
        public List<String> ListCategory { get; set; }
        public List<RecipeIngredientCreateViewModel> ListIngredient { get; set; }
        public List<StepsOfRecipeCreateViewModel> ListSORVM { get; set; }
    }

    public class RecipeViewModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
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
        public string Description { get; set; }
        public string SharedStatus { get; set; }
        public int? ReferencedRecipeId { get; set; }
        public List<StepsOfRecipeViewModel> ListSORVM { get; set; }
        public List<RecipeIngredientViewModel> listIngredient { get; set; }
        public List<RecipeCategoryViewModel> listCategory { get; set; }
        public AccountViewModel AccountVM { get; set; }
    }
}
