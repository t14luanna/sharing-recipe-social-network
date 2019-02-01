using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class LikePostViewModel
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PostId { get; set; }
    }
}
