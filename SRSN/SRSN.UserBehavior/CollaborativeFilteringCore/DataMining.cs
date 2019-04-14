using ServiceStack.Redis;
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
        private RecipeService recipeService;
        private static string redisRankRecipe= "Rank_Recipe_";
        public DataMining(UserRecipePointService userRecipePointService, RecipeService recipeService)
        {
            this.userRecipePointService = userRecipePointService;
            this.recipeService = recipeService;
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

        public void UpdateTotalViewLikeShare()
        {
            var listUserRecipeRating = userRecipePointService.GetListUserRecipePoints().Result;
            var listRecipes = recipeService.GetListRecipes().Result;
            foreach (var recipe in listRecipes)
            {
                int totalView = 0;
                int totalLike = 0;
                int totalShare = 0;
                foreach (var itemReaction in listUserRecipeRating)
                {
                    if (recipe.Id == itemReaction.RecipeId)
                    {
                        if (itemReaction.TotalView == null)
                        {
                            itemReaction.TotalView = 0;
                        }
                        if (itemReaction.TotalShare == null)
                        {
                            itemReaction.TotalShare = 0;
                        }
                        if (itemReaction.IsLike == null || itemReaction.IsLike == false)
                        {
                            totalLike += 0;
                        }
                        if (itemReaction.IsLike == true)
                        {
                            totalLike += 1;
                        }
                        totalView += itemReaction.TotalView.Value;
                        totalShare += itemReaction.TotalShare.Value;
                    }
                }
                recipe.ViewQuantity = totalView;
                recipe.ShareQuantity = totalShare;
                recipe.LikeQuantity = totalLike;
                recipeService.Update(recipe);
            }
        }
        public void CalculateRankRecipe(IRedisClient redisClient)
        {
            double score = 0;
            double[] scoreRecipe;
            var recipeContain = new List<Recipe>();
            var listRecipes = recipeService.GetListRecipes().Result;
            foreach (var recipe in listRecipes)
            {
                var totalView = recipe.ViewQuantity.Value;
                var totalShare = recipe.ShareQuantity.Value;
                var totalLike = recipe.LikeQuantity.Value;
                var ratingRecipe = recipe.EvRating.Value;
                var createRecipeTime = DateTime.Now.ToLocalTime();
                var currentTime = DateTime.Now.ToLocalTime();
                if (recipe.CreateTime != null)
                {
                    createRecipeTime = recipe.CreateTime.Value;
                }
                else if (recipe.UpdateTime != null)
                {
                    createRecipeTime = recipe.UpdateTime.Value;
                }
                var timeLeft = currentTime - createRecipeTime;
                score = (ratingRecipe * 0.4 + totalView * 0.1 + totalLike * 0.3 + totalShare * 0.2) / timeLeft.TotalHours;
                redisClient.AddItemToSortedSet(redisRankRecipe, recipe.Id.ToString(), score);
            }
        }

    }
}
