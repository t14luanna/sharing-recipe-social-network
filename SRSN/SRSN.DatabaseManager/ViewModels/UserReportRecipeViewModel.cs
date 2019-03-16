using System;
using System.Collections.Generic;
using System.Text;
using SRSN.DatabaseManager.Entities;

namespace SRSN.DatabaseManager.ViewModels
{
    public class UserReportRecipeViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RecipeReportedId { get; set; }
        public string Description { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? IsActive { get; set; }
    }
}
