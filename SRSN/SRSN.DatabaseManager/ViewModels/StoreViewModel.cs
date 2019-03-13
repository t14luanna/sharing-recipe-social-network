using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class StoreViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int? BrandId { get; set; }
        public double? Lat { get; set; }
        public double? Long { get; set; }

    }
}
