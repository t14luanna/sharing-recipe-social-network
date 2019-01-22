using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class CategoryItem
    {
        public CategoryItem()
        {
            RecipeCategory = new HashSet<RecipeCategory>();
        }

        public int Id { get; set; }
        public string CategoryItemName { get; set; }
        public int? CategoryMainId { get; set; }

        public CategoryMain CategoryMain { get; set; }
        public ICollection<RecipeCategory> RecipeCategory { get; set; }
    }
}
