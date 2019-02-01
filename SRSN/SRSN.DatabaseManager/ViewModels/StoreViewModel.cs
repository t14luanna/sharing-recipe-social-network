using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class StoreViewModel
    {
        public int Id { get; set; }
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Lat { get; set; }
        public string Long { get; set; }
        public int? BrandId { get; set; }

    }
}
