using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
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

        public ICollection<IngredientBrand> IngredientBrand { get; set; }
        public ICollection<RecipeIngredient> RecipeIngredient { get; set; }
    }
}
