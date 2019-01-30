using System;
using System.Collections.Generic;

namespace SRSN.Service.Entities
{
    public partial class RatingRecipe
    {
        public int Id { get; set; }
        public int? Star { get; set; }
        public string UserId { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUr { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
