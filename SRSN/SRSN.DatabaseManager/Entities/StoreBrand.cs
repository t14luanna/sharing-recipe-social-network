using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class StoreBrand
    {
        public StoreBrand()
        {
            Ingredients = new HashSet<Ingredients>();
            Store = new HashSet<Store>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<Ingredients> Ingredients { get; set; }
        public virtual ICollection<Store> Store { get; set; }
    }
}
