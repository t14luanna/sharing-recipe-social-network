using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class RecipeCategory
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public int? CategoryItemId { get; set; }

        public CategoryItem CategoryItem { get; set; }
        public Recipe Recipe { get; set; }
    }
}
