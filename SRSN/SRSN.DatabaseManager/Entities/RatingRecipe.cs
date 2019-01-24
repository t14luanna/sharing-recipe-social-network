using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class RatingRecipe
    {
        public int Id { get; set; }
        public int? Star { get; set; }
        public string Username { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUr { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual User UsernameNavigation { get; set; }
    }
}
