using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class CollectionViewModel
    {
        
        public int Id { get; set; }
        public string CollectionName { get; set; }
        public string UserId { get; set; }
    }
}
