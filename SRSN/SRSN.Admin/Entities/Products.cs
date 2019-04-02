using System;
using System.Collections.Generic;

namespace SRSN.Admin.Entities
{
    public partial class Products
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string ImageUrl { get; set; }
        public int? BrandId { get; set; }

        public virtual StoreBrand Brand { get; set; }
    }
}
