using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class IngredientsViewModel
    {
        public int Id { get; set; }
        public string IngredientName { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }

    }
}
