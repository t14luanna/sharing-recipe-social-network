using SRSN.UserBehavior.Entities;
using SRSN.UserBehavior;
using SRSN.UserBehavior.Entities.Services;
using SRSN.UserBehavior.Redis;
using System;
using System.Collections.Generic;
using System.Threading;
using SRSN.UserBehavior.CollaborativeFilteringCore;

namespace SRSN.UserBehavior
{
    public class Program
    {
        static void Main(string[] args)
        {
            #region Fake Data https://machinelearningcoban.com/2017/05/24/collaborativefiltering/
            //var testData = new List<UserRecipePoint>()
            //{
            //    new UserRecipePoint() { UserId = 0, RecipeId = 0, RatingRecipe = 5 },
            //    new UserRecipePoint() { UserId = 0, RecipeId = 1, RatingRecipe = 4 },
            //    new UserRecipePoint() { UserId = 0, RecipeId = 3, RatingRecipe = 2 },
            //    new UserRecipePoint() { UserId = 0, RecipeId = 4, RatingRecipe = 2 },
            //    new UserRecipePoint() { UserId = 1, RecipeId = 0, RatingRecipe = 5 },
            //    new UserRecipePoint() { UserId = 1, RecipeId = 2, RatingRecipe = 4 },
            //    new UserRecipePoint() { UserId = 1, RecipeId = 3, RatingRecipe = 2 },
            //    new UserRecipePoint() { UserId = 1, RecipeId = 4, RatingRecipe = 0 },
            //    new UserRecipePoint() { UserId = 2, RecipeId = 0, RatingRecipe = 2 },
            //    new UserRecipePoint() { UserId = 2, RecipeId = 2, RatingRecipe = 1 },
            //    new UserRecipePoint() { UserId = 2, RecipeId = 3, RatingRecipe = 3 },
            //    new UserRecipePoint() { UserId = 2, RecipeId = 4, RatingRecipe = 4 },
            //    new UserRecipePoint() { UserId = 3, RecipeId = 0, RatingRecipe = 0 },
            //    new UserRecipePoint() { UserId = 3, RecipeId = 1, RatingRecipe = 0 },
            //    new UserRecipePoint() { UserId = 3, RecipeId = 3, RatingRecipe = 4 },
            //    new UserRecipePoint() { UserId = 4, RecipeId = 0, RatingRecipe = 1 },
            //    new UserRecipePoint() { UserId = 4, RecipeId = 3, RatingRecipe = 4 },
            //    new UserRecipePoint() { UserId = 5, RecipeId = 1, RatingRecipe = 2 },
            //    new UserRecipePoint() { UserId = 5, RecipeId = 2, RatingRecipe = 1 },
            //    new UserRecipePoint() { UserId = 6, RecipeId = 2, RatingRecipe = 1 },
            //    new UserRecipePoint() { UserId = 6, RecipeId = 3, RatingRecipe = 4 },
            //    new UserRecipePoint() { UserId = 6, RecipeId = 4, RatingRecipe = 5 }
            //}; 
            #endregion
            var count = 0;
            do
            {
                var currentTime = DateTime.UtcNow.AddHours(7).ToString("dd/MM/yyyy, HH:mm:ss");
                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine($"Collaborative Filtering User-User System, start at {currentTime}");
                Console.WriteLine($"Time to started: {++count}");
                using (var unitOfWork = new UnitOfWork())
                using (var redisClient = RedisUtil.GetDatabase().GetClient())
                {
                    var userRecipePointService = new UserRecipePointService(unitOfWork);

                    var dataMining = new DataMining(userRecipePointService);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine("Loading user recipe point data...");
                    dataMining.CalculateTruePointOfUserRecipeRating();
                    Console.WriteLine("Loading user recipe point data...");
                    var data = userRecipePointService.GetListUserRecipePoints().Result;
                    Console.WriteLine("Loading user recipe point data success!\n");
                    Console.WriteLine("Start collaborative filtering system");
                    var collaborativeSystem = new CollaborativeFiltering(data.ToArray(), 2, true);
                    collaborativeSystem.Normalize();
                    collaborativeSystem.Similarity();
                    collaborativeSystem.RecommendItems(redisClient);
                }
                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine($"Done, tool collaborative filter system will start after 3 hours, current time: {currentTime}");
                Thread.Sleep(1000*10);
                Console.Clear();
            } while (true);
        }
    }
}
