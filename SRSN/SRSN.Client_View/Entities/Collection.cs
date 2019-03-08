using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class Collection
    {
        public Collection()
        {
            CollectionPost = new HashSet<CollectionPost>();
        }

        public int Id { get; set; }
        public string CollectionName { get; set; }
        public int UserId { get; set; }
        public bool? Active { get; set; }
        public int? SaveCount { get; set; }
        public string CoverImage { get; set; }

        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<CollectionPost> CollectionPost { get; set; }
    }
}
