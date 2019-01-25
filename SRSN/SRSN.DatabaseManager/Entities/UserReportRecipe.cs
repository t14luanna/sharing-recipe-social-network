using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserReportRecipe
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int RecipeReportedId { get; set; }
        public int? Description { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
