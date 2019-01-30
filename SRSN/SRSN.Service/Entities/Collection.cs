using System;
using System.Collections.Generic;

namespace SRSN.Service.Entities
{
    public partial class Collection
    {
        public Collection()
        {
            CollectionPost = new HashSet<CollectionPost>();
        }

        public int Id { get; set; }
        public string CollectionName { get; set; }
        public string UserId { get; set; }

        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<CollectionPost> CollectionPost { get; set; }
    }
}
