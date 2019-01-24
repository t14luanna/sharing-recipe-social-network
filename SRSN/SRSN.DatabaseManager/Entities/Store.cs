using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class Store
    {
        public Store()
        {
            IngredientBrand = new HashSet<IngredientBrand>();
        }

        public int Id { get; set; }
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Lat { get; set; }
        public string Long { get; set; }
        public int? BrandId { get; set; }

        public virtual StoreBrand Brand { get; set; }
        public virtual ICollection<IngredientBrand> IngredientBrand { get; set; }
    }
}
