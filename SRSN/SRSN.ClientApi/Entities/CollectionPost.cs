﻿using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class CollectionPost
    {
        public int Id { get; set; }
        public int CollectionId { get; set; }
        public int RecipePostId { get; set; }

        public virtual Collection Collection { get; set; }
        public virtual Recipe RecipePost { get; set; }
    }
}
