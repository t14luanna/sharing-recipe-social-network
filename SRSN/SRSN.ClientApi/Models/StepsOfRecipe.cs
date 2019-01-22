using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class StepsOfRecipe
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }

        public Recipe Recipe { get; set; }
    }
}
