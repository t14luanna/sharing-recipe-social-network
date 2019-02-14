using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class Ingredients
    {
        public Ingredients()
        {
            IngredientBrand = new HashSet<IngredientBrand>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string ImageUrl { get; set; }
        public int? BrandId { get; set; }

        public virtual StoreBrand Brand { get; set; }
        public virtual ICollection<IngredientBrand> IngredientBrand { get; set; }
    }
}
