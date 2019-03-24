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
                    var recipeService = new RecipeService(unitOfWork);
                    var dataMining = new DataMining(userRecipePointService, recipeService);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine("Update like share view in recipe...");
                    dataMining.UpdateTotalViewLikeShare();
                    Console.WriteLine("Calculate like share view score in recipe...");
                    dataMining.CalculateRankRecipe(redisClient);
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
                Thread.Sleep(1000*60*180);
                Console.Clear();
            } while (true);
        }
    }
}
