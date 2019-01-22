using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
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

        public User UsernameNavigation { get; set; }
        public ICollection<CollectionPost> CollectionPost { get; set; }
    }
}
