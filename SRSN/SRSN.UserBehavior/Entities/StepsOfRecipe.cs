﻿using System;
using System.Collections.Generic;

namespace SRSN.UserBehavior.Entities
{
    public partial class StepsOfRecipe
    {
        public int Id { get; set; }
        public int? RecipeId { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        public string Tips { get; set; }

        public virtual Recipe Recipe { get; set; }
    }
}
