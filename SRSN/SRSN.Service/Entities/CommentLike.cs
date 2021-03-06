﻿using System;
using System.Collections.Generic;

namespace SRSN.Service.Entities
{
    public partial class CommentLike
    {
        public int Id { get; set; }
        public int CommentId { get; set; }
        public string UserId { get; set; }

        public virtual Comment Comment { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
