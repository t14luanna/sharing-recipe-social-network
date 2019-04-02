using System;
using System.Collections.Generic;

namespace SRSN.Admin.Entities
{
    public partial class Message
    {
        public int Id { get; set; }
        public string MessageContent { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? IsRead { get; set; }
        public int? RecipientId { get; set; }
        public int? CreatorId { get; set; }

        public virtual AspNetUsers Creator { get; set; }
        public virtual AspNetUsers Recipient { get; set; }
    }
}
