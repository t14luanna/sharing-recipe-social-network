using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.UserBehavior.CollaborativeFilteringCore
{
    public class ItemBasedPredictionData
    {

        public int ItemId { get; set; }
        public int UserId { get; set; }
        public double ItemSimilarityPoint { get; set; }
        public double ItemNormalizeRating { get; set; }

        public override string ToString()
        {
            return string.Format($"UserId: {this.UserId}, ItemId: {this.ItemId}, Similarity Point: {this.ItemSimilarityPoint}, User Normalize Rating: {this.ItemNormalizeRating}");
        }
    }
}
