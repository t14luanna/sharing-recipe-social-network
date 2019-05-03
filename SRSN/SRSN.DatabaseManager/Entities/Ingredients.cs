using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class Ingredients
    {
        public int Id { get; set; }
        public string IngredientName { get; set; }
        public string SuggestQuantitive { get; set; }
    }
}
