using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class StoreBrand
    {
        public StoreBrand()
        {
            Products = new HashSet<Products>();
            Store = new HashSet<Store>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<Products> Products { get; set; }
        public virtual ICollection<Store> Store { get; set; }
    }
}
