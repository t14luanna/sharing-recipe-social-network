using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class IngredientList
    {
        public int Id { get; set; }
        public int IngredientId { get; set; }
        public int? RecipeId { get; set; }
        public bool? IsBought { get; set; }
        public string UserId { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
