using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class UserReportRecipe
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int RecipeReportedId { get; set; }
        public int? Description { get; set; }

        public User UsernameNavigation { get; set; }
    }
}
