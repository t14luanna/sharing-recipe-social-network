using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.UserBehavior.CollaborativeFilteringCore
{
    public class UserItemRating
    {
        public UserItemRating(int userId, int itemId, int rating)
        {
            this.UserId = userId;
            this.ItemId = itemId;
            this.Rating = rating;
        }
        public int UserId { get; set; }
        public int ItemId { get; set; }
        public double Rating { get; set; }
    }
}
