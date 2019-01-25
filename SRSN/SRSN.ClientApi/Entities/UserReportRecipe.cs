using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Entities
{
    public partial class UserReportRecipe
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int RecipeReportedId { get; set; }
        public int? Description { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? IsActive { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
