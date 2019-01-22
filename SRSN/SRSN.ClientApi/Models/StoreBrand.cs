using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class StoreBrand
    {
        public StoreBrand()
        {
            Store = new HashSet<Store>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? PriceRating { get; set; }
        public int? QuantityRating { get; set; }
        public string Description { get; set; }
        public string Fanpage { get; set; }
        public string Website { get; set; }
        public string Email { get; set; }

        public ICollection<Store> Store { get; set; }
    }
}
