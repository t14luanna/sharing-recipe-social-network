using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class Ingredients
    {
        public Ingredients()
        {
            IngredientBrand = new HashSet<IngredientBrand>();
            RecipeIngredient = new HashSet<RecipeIngredient>();
        }

        public int Id { get; set; }
        public string IngredientName { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }

        public virtual ICollection<IngredientBrand> IngredientBrand { get; set; }
        public virtual ICollection<RecipeIngredient> RecipeIngredient { get; set; }
    }
}
