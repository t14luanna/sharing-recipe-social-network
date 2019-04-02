using System;
using System.Collections.Generic;

namespace SRSN.Service.Entities
{
    public partial class RecipeIngredient
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public int? IngredientId { get; set; }
        public string IngredientName { get; set; }
        public string Quantitative { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual Recipe Recipe { get; set; }
    }
}
