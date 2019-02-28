using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.UserBehavior.CollaborativeFilteringCore
{
    public class PredictionData
    {

        public int UserId { get; set; }
        public double UserSimilarityPoint { get; set; }
        public double UserNormalizeRating { get; set; }

        public override string ToString()
        {
            return string.Format($"User Id: {this.UserId}, Similarity Point: {this.UserSimilarityPoint}, User Normalize Rating: {this.UserNormalizeRating}");
        }
    }
}
