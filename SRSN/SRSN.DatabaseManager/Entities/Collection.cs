using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class Collection
    {
        public Collection()
        {
            CollectionPost = new HashSet<CollectionPost>();
        }

        public int Id { get; set; }
        public string CollectionName { get; set; }
        public string Username { get; set; }

        public virtual User UsernameNavigation { get; set; }
        public virtual ICollection<CollectionPost> CollectionPost { get; set; }
    }
}
