using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class Ingredients
    {
        public Ingredients()
        {
            IngredientBrand = new HashSet<IngredientBrand>();
            IngredientList = new HashSet<IngredientList>();
            RecipeIngredient = new HashSet<RecipeIngredient>();
        }

        public int Id { get; set; }
        public string IngredientName { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }

        public virtual ICollection<IngredientBrand> IngredientBrand { get; set; }
        public virtual ICollection<IngredientList> IngredientList { get; set; }
        public virtual ICollection<RecipeIngredient> RecipeIngredient { get; set; }
    }
}
