﻿using System;
using System.Collections.Generic;

namespace SRSN.UserBehavior.Entities
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

        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<CollectionPost> CollectionPost { get; set; }
    }
}