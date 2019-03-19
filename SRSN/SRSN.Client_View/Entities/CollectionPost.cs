using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class CollectionPost
    {
        public int CollectionId { get; set; }
        public int RecipePostId { get; set; }
        public bool? IsActive { get; set; }

        public virtual Collection Collection { get; set; }
        public virtual Recipe RecipePost { get; set; }
    }
}
