using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class ShoppingList
    {
        public int Id { get; set; }
        public string IngredientId { get; set; }
        public int? RecipeId { get; set; }
        public bool? IsBought { get; set; }
        public string UserId { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
