using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class Message
    {
        public int Id { get; set; }
        public string MessageContent { get; set; }
        public DateTime? CreateTime { get; set; }
        public bool? IsRead { get; set; }
        public string RecipientId { get; set; }
        public string CreatorId { get; set; }

        public User Creator { get; set; }
        public User Recipient { get; set; }
    }
}
