﻿using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class IngredientBrand
    {
        public int Id { get; set; }
        public int? IngredientId { get; set; }
        public double? Pirce { get; set; }
        public string ImageUrl { get; set; }
        public int? StoreId { get; set; }
        public string IngredientName { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual Store Store { get; set; }
    }
}
