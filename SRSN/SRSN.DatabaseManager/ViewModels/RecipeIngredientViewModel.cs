using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class RecipeIngredientViewModel
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public int? IngredientId { get; set; }
        public string IngredientName { get; set; }
        public string Quantitative { get; set; }
    }
}
