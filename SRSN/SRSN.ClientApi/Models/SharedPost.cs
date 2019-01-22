using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class SharedPost
    {
        public SharedPost()
        {
            Comment = new HashSet<Comment>();
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public double? Price { get; set; }
        public string ImageUrl { get; set; }
        public int? LevelRecipe { get; set; }
        public int? Serving { get; set; }
        public int? RecipeId { get; set; }
        public string ContentPost { get; set; }
        public string VideoUrl { get; set; }

        public Recipe Recipe { get; set; }
        public User UsernameNavigation { get; set; }
        public ICollection<Comment> Comment { get; set; }
    }
}
