using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class RecipeCategory
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public int? CategoryItemId { get; set; }

        public virtual CategoryItem CategoryItem { get; set; }
        public virtual Recipe Recipe { get; set; }
    }
}
