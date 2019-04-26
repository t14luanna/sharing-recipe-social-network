using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class Recipe
    {
        public Recipe()
        {
            CollectionPost = new HashSet<CollectionPost>();
            Comment = new HashSet<Comment>();
            RatingRecipe = new HashSet<RatingRecipe>();
            RecipeCategory = new HashSet<RecipeCategory>();
            RecipeIngredient = new HashSet<RecipeIngredient>();
            StepsOfRecipe = new HashSet<StepsOfRecipe>();
            UserReactionRecipe = new HashSet<UserReactionRecipe>();
            UserReportRecipe = new HashSet<UserReportRecipe>();
        }

        public int Id { get; set; }
        public string ImageCover { get; set; }
        public string ContentRecipe { get; set; }
        public DateTime? CreateTime { get; set; }
        public DateTime? UpdateTime { get; set; }
        public int? UserId { get; set; }
        public string RecipeName { get; set; }
        public string VideoLink { get; set; }
        public int? LevelRecipe { get; set; }
        public int? CookTime { get; set; }
        public int? Serving { get; set; }
        public bool? Active { get; set; }
        public double? EvRating { get; set; }
        public string SharedStatus { get; set; }
        public int? ReferencedRecipeId { get; set; }
        public int? ViewQuantity { get; set; }
        public int? LikeQuantity { get; set; }
        public int? ShareQuantity { get; set; }
        public bool? SaveDraft { get; set; }

        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<CollectionPost> CollectionPost { get; set; }
        public virtual ICollection<Comment> Comment { get; set; }
        public virtual ICollection<RatingRecipe> RatingRecipe { get; set; }
        public virtual ICollection<RecipeCategory> RecipeCategory { get; set; }
        public virtual ICollection<RecipeIngredient> RecipeIngredient { get; set; }
        public virtual ICollection<StepsOfRecipe> StepsOfRecipe { get; set; }
        public virtual ICollection<UserReactionRecipe> UserReactionRecipe { get; set; }
        public virtual ICollection<UserReportRecipe> UserReportRecipe { get; set; }
    }
}
