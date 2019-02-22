using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class CategoryItemViewModel
    {
        public int Id { get; set; }
        public string CategoryItemName { get; set; }
        public int? CategoryMainId { get; set; }
    }
}
