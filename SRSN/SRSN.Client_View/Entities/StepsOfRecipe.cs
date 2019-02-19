using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class StepsOfRecipe
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }

        public virtual Recipe Recipe { get; set; }
    }
}
