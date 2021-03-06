﻿using System;
using System.Collections.Generic;

namespace SRSN.UserBehavior.Entities
{
    public partial class Ingredients
    {
        public Ingredients()
        {
            RecipeIngredient = new HashSet<RecipeIngredient>();
        }

        public int Id { get; set; }
        public string IngredientName { get; set; }
        public int? UserId { get; set; }

        public virtual ICollection<RecipeIngredient> RecipeIngredient { get; set; }
    }
}
