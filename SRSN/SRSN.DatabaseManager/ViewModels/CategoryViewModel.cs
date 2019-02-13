using SRSN.DatabaseManager.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class CategoryViewModel
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }

        public virtual ICollection<CategoryItem> CategoryItem { get; set; }
    }
}
