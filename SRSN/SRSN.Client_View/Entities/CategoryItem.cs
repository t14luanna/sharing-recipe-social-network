using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
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

        public virtual CategoryMain CategoryMain { get; set; }
        public virtual ICollection<RecipeCategory> RecipeCategory { get; set; }
    }
}
