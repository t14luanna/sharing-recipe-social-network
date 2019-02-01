using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class StepsOfRecipeViewModel
    {
        public int Id { get; set; }
        /// <summary>
        /// cai field nay` la khi nao tao Recipe xong moi co nen ta co the comment lai, khong can dung no
        /// khi nao bien thanh entities xong thi minh mapping nguoc lai cung khong muon
        /// </summary>
        public int? RecipeId { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
    }
}
