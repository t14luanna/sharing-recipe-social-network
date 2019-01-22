using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class CollectionPost
    {
        public int Id { get; set; }
        public int CollectionId { get; set; }
        public int RecipePostId { get; set; }

        public Collection Collection { get; set; }
    }
}
