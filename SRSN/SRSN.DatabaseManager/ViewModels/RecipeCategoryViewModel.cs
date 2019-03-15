using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class RecipeCategoryViewModel
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public int? CategoryItemId { get; set; }
        public string CategoryItemName { get; set; }
        

    }
}
