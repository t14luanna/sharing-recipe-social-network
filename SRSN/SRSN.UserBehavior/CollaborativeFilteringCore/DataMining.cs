using SRSN.UserBehavior.Entities;
using SRSN.UserBehavior.Entities.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.UserBehavior.CollaborativeFilteringCore
{
    public class DataMining
    {
        private UserRecipePointService userRecipePointService;
        public DataMining(UserRecipePointService userRecipePointService)
        {
            this.userRecipePointService = userRecipePointService;
        }

        public void CalculateTruePointOfUserRecipeRating()
        {
            double baseRating = 2;
            double maxRating = 5;
            var listUserRecipeRating = userRecipePointService.GetListUserRecipePoints().Result;
            foreach (var item in listUserRecipeRating)
            {
                var sharePoint = (item.IsShare ?? false) ? 5 : 0;
                var likePoint = (item.IsLike ?? false) ? 5 : 0;
                var viewPoint = (item.IsView ?? false) ? 5 : 0;
                var ratingPoint = item.RatingRecipe == null ? 0 : item.RatingRecipe;
                var calculatedRating = (((ratingPoint - baseRating) * (maxRating / (maxRating - baseRating))) + sharePoint + likePoint + viewPoint) / 4;
                item.CalculatedRating = calculatedRating;
                userRecipePointService.Update(item);
            }
        }
    }
}
