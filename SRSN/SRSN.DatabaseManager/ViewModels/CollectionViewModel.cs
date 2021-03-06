﻿using System;
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
        public bool? Active { get; set; }
        public int? SaveCount { get; set; }
        public string CoverImage { get; set; }
        public string FullName { get; set; }
        public int? RecipeCount { get; set; }
        public int? CollectionRefId { get; set; }
    }
}
