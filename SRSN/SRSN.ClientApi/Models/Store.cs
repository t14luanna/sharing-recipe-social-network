using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
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

        public StoreBrand Brand { get; set; }
        public ICollection<IngredientBrand> IngredientBrand { get; set; }
    }
}
