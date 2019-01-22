using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class Recipe
    {
        public Recipe()
        {
            RatingRecipe = new HashSet<RatingRecipe>();
            RecipeCategory = new HashSet<RecipeCategory>();
            RecipeIngredient = new HashSet<RecipeIngredient>();
            SharedPost = new HashSet<SharedPost>();
            ShoppingList = new HashSet<ShoppingList>();
            StepsOfRecipe = new HashSet<StepsOfRecipe>();
        }

        public int Id { get; set; }
        public string ImageCover { get; set; }
        public DateTime? CreateTime { get; set; }
        public string Username { get; set; }
        public string RecipeName { get; set; }
        public string VideoLink { get; set; }
        public int? LevelRecipe { get; set; }
        public int? CookTime { get; set; }
        public int? Serving { get; set; }

        public User UsernameNavigation { get; set; }
        public ICollection<RatingRecipe> RatingRecipe { get; set; }
        public ICollection<RecipeCategory> RecipeCategory { get; set; }
        public ICollection<RecipeIngredient> RecipeIngredient { get; set; }
        public ICollection<SharedPost> SharedPost { get; set; }
        public ICollection<ShoppingList> ShoppingList { get; set; }
        public ICollection<StepsOfRecipe> StepsOfRecipe { get; set; }
    }
}
