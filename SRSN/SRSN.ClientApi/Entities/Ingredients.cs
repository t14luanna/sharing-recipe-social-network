using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class Ingredients
    {
        public Ingredients()
        {
            StoreBrandIngredient = new HashSet<StoreBrandIngredient>();
        }

        public int Id { get; set; }
        public string IngredientName { get; set; }
        public string SuggestQuantitive { get; set; }

        public virtual ICollection<StoreBrandIngredient> StoreBrandIngredient { get; set; }
    }
}
