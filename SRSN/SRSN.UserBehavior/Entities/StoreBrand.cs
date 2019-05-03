using System;
using System.Collections.Generic;

namespace SRSN.UserBehavior.Entities
{
    public partial class StoreBrand
    {
        public StoreBrand()
        {
            Products = new HashSet<Products>();
            Store = new HashSet<Store>();
            StoreBrandIngredient = new HashSet<StoreBrandIngredient>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<Products> Products { get; set; }
        public virtual ICollection<Store> Store { get; set; }
        public virtual ICollection<StoreBrandIngredient> StoreBrandIngredient { get; set; }
    }
}
