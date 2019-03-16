using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class RatingRecipe
    {
        public RatingRecipe()
        {
            Comment = new HashSet<Comment>();
        }

        public int Id { get; set; }
        public double? Star { get; set; }
        public int? UserId { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? CreateTime { get; set; }
        public string ContentRating { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual AspNetUsers User { get; set; }
        public virtual ICollection<Comment> Comment { get; set; }
    }
}
