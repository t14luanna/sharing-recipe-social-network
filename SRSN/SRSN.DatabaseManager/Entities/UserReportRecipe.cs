using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class UserReportRecipe
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int RecipeReportedId { get; set; }
        public int? Description { get; set; }

        public virtual User UsernameNavigation { get; set; }
    }
}
