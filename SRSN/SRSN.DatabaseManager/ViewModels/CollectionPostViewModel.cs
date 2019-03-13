using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class CollectionPostViewModel
    {
        public int Id { get; set; }
        public int CollectionId { get; set; }
        public int RecipePostId { get; set; }
        public string ImageCover { get; set; }
        public string UserId { get; set; }
        public string RecipeName { get; set; }
        public string AuthorName { get; set; }
        public string AvatarImageUrl { get; set; }
    }
}
