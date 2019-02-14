using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class Store
    {
        public Store()
        {
            IngredientBrand = new HashSet<IngredientBrand>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int? BrandId { get; set; }

        public virtual StoreBrand Brand { get; set; }
        public virtual ICollection<IngredientBrand> IngredientBrand { get; set; }
    }
}
