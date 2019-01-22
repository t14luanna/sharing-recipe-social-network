using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class ShoppingList
    {
        public int Id { get; set; }
        public string IngredientId { get; set; }
        public int? RecipeId { get; set; }
        public bool? IsBought { get; set; }
        public string Username { get; set; }

        public Recipe Recipe { get; set; }
        public User UsernameNavigation { get; set; }
    }
}
