﻿using System;
using System.Collections.Generic;

namespace SRSN.UserBehavior.Entities
{
    public partial class StoreBrandIngredient
    {
        public int StoreBrandId { get; set; }
        public int IngredientId { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual StoreBrand StoreBrand { get; set; }
    }
}