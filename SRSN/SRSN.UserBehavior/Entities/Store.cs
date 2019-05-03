using System;
using System.Collections.Generic;

namespace SRSN.UserBehavior.Entities
{
    public partial class Store
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int? BrandId { get; set; }
        public double? Lat { get; set; }
        public double? Long { get; set; }

        public virtual StoreBrand Brand { get; set; }
    }
}
