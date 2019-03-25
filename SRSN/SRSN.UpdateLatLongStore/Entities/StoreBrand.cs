using System;
using System.Collections.Generic;

namespace SRSN.UpdateLatLongStore.Entities
{
    public partial class StoreBrand
    {
        public StoreBrand()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
