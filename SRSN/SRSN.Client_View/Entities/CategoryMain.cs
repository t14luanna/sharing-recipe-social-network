﻿using System;
using System.Collections.Generic;

namespace SRSN.Client_View.Entities
{
    public partial class CategoryMain
    {
        public CategoryMain()
        {
            CategoryItem = new HashSet<CategoryItem>();
        }

        public int Id { get; set; }
        public string CategoryName { get; set; }

        public virtual ICollection<CategoryItem> CategoryItem { get; set; }
    }
}