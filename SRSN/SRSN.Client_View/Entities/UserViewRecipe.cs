using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class UserViewRecipe
    {
        public int UserId { get; set; }
        public int RecipeId { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
