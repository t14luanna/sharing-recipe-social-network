using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
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
        public string UserId { get; set; }
        public string RecipeName { get; set; }
        public string VideoLink { get; set; }
        public int? LevelRecipe { get; set; }
        public int? CookTime { get; set; }
        public int? Serving { get; set; }

        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<RatingRecipe> RatingRecipe { get; set; }
        public virtual ICollection<RecipeCategory> RecipeCategory { get; set; }
        public virtual ICollection<RecipeIngredient> RecipeIngredient { get; set; }
        public virtual ICollection<SharedPost> SharedPost { get; set; }
        public virtual ICollection<ShoppingList> ShoppingList { get; set; }
        public virtual ICollection<StepsOfRecipe> StepsOfRecipe { get; set; }
    }
}
