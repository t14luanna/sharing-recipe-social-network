using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class RecipeIngredient
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public int? IngredientId { get; set; }
        public string Quantitative { get; set; }

        public Ingredients Ingredient { get; set; }
        public Recipe Recipe { get; set; }
    }
}
