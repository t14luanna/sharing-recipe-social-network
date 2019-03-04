using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Linq;
using NumSharp.Core;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;
using MathNet.Numerics;
using SRSN.UserBehavior.Entities;
using ServiceStack.Redis;
using SRSN.UserBehavior.CollaborativeFilteringCore;

namespace SRSN.UserBehavior
{
    public class CollaborativeFiltering
    {
        private static string redisRecommenderItemBased = "RCS_Recipe_";
        private static string redisRecommenderUserBased = "RCS_User_";

        private UserRecipePoint[] data;
        private Matrix<double> normalizedMatrix;
        private Matrix<double> similarityMatrix;

        private int k;
        private bool isUucf;

        private int[] users;
        private int[] items;

        private int numberOfUsers;
        private int numberOfItems;

        public CollaborativeFiltering(UserRecipePoint[] data, int k, bool isUucf)
        {
            this.data = data;
            this.users = data.Select(x => x.UserId).ToArray();
            this.items = data.Select(x => x.RecipeId).ToArray();
            this.numberOfUsers = users.Distinct().Max() + 1;
            this.numberOfItems = items.Distinct().Max() +1;
            this.k = k;
            this.isUucf = isUucf;
        }
        public void Normalize()
        {
            UserRecipePoint[] tempData = new UserRecipePoint[this.data.Count()];
            this.data.CopyTo(tempData, 0);
            var mu = np.zeros(numberOfUsers);

            if (this.isUucf)
            {
                for (var userIndex = 0; userIndex < numberOfUsers; userIndex++)
                {
                    var userId = userIndex + 1;
                    int ids = this.users.FirstOrDefault(x => x == userId);
                    var dataWithIds = this.data.Where(x => x.UserId == ids);
                    double[] rating_ids = dataWithIds.Select(x => x.CalculatedRating.Value).ToArray();
                    double m = 0;
                    if (rating_ids.Length > 0)
                    {
                        m = rating_ids.Average(x => x);
                    }
                    mu[userIndex] = m;
                    foreach (var uir in tempData.Where(x => x.UserId == ids))
                    {
                        double doubleRating = (double)uir.CalculatedRating;
                        doubleRating = doubleRating - (double)mu[userIndex];
                        uir.Point = doubleRating;
                    }
                }
            }
            else
            {
                for (var itemIndex = 0; itemIndex < numberOfItems; itemIndex++)
                {
                    var itemId = itemIndex + 1;
                    int ids = this.items.FirstOrDefault(x => x == itemId);
                    var dataWithIds = this.data.Where(x => x.RecipeId == ids);
                    double[] rating_ids = dataWithIds.Select(x => x.CalculatedRating.Value).ToArray();
                    double m = 0;
                    if (rating_ids.Length > 0)
                    {
                        m = rating_ids.Average(x => x);
                    }
                    mu[itemIndex] = m;

                    foreach (var uir in tempData.Where(x => x.RecipeId == ids))
                    {
                        double doubleRating = (double)uir.CalculatedRating;
                        doubleRating = doubleRating - (double)mu[itemIndex];
                        uir.Point = doubleRating;
                    }
                }
            }
            //Convert To Parse Matrix
            var normalizedResult = new double[numberOfItems, numberOfUsers];
            for (int r = 0; r < numberOfItems; r++)
            {
                for (int c = 0; c < numberOfUsers; c++)
                {
                    var rating = tempData.Where(x => x.RecipeId == (r) && x.UserId == (c)).FirstOrDefault();
                    if (rating == null)
                    {
                        normalizedResult[r, c] = 0;
                    }
                    else
                    {
                        normalizedResult[r, c] = Rounding2DecimalPlace(rating.Point.Value);
                    }
                }
            }
            var matrix = DenseMatrix.OfArray(normalizedResult);
            var bar = new SparseMatrix(numberOfItems, numberOfUsers);
            this.normalizedMatrix = bar.Add(matrix);
            Console.WriteLine("=================================");
            Console.WriteLine("Normalized Matrix: ");
            Console.WriteLine(this.normalizedMatrix);
        }
        public const double Epsilon = 1.0E-6;

        // Calculate the similarity matrix
        public void Similarity()
        {
            if (this.isUucf)
            {
                var similarity = new double[numberOfUsers, numberOfUsers];
                var a = this.normalizedMatrix.ToColumnArrays();
                for (var i = 0; i < a.Length; i++)
                {
                    for (int j = 0; j < a.Length; j++)
                    {
                        var similarityPoint = 1 - Distance.Cosine(a[i], a[j]);
                        similarity[i, j] = Rounding2DecimalPlace(similarityPoint);
                    }
                }
                this.similarityMatrix = DenseMatrix.OfArray(similarity);
                Console.WriteLine("=================================");
                Console.WriteLine("Similarity Matrix: ");
                Console.WriteLine(this.similarityMatrix);
            }
            else
            {
                var similarity = new double[numberOfItems, numberOfItems];
                var a = this.normalizedMatrix.ToRowArrays();
                for (var i = 0; i < a.Length; i++)
                {
                    for (int j = 0; j < a.Length; j++)
                    {
                        var similarityPoint = 1 - Distance.Cosine(a[i], a[j]);
                        similarity[i, j] = Rounding2DecimalPlace(similarityPoint);
                    }
                }
                this.similarityMatrix = DenseMatrix.OfArray(similarity);
                Console.WriteLine("=================================");
                Console.WriteLine("Similarity Matrix: ");
                Console.WriteLine(this.similarityMatrix);
            }
        }

        /// <summary>
        /// Predict the ? point 
        /// User - Ite
        /// </summary>
        private void PrivatePredict(int u, int i, int normalized = 1)
        {
            if (this.isUucf)
            {
                var predictionUserIndex = u;
                var predictionItemIndex = i;
                // predict the rating of user u for item i (normalized)
                // if you need the un

                // Step 1: find all users who rated i
                var ids = this.data.Where(x => x.RecipeId == i && x.UserId != u).Select(x => x.UserId).ToArray();
                // Step 2: 

                // Step 3: find similarity btw the current user and others who already rated i
                var predictionDatas = new PredictionData[ids.Count()];
                for (int index = 0; index < ids.Count(); index++)
                {
                    var similarityUserIndex = ids[index];

                    var similarityPoint = this.similarityMatrix[similarityUserIndex, predictionUserIndex];
                    predictionDatas[index] = new PredictionData
                    {
                        UserId = u,
                        UserSimilarityPoint = similarityPoint,
                        UserNormalizeRating = this.normalizedMatrix[predictionItemIndex, similarityUserIndex]
                    };
                }
                predictionDatas = predictionDatas.OrderByDescending(x => x.UserSimilarityPoint).Take(this.k).ToArray();
                var theBottom = predictionDatas.Sum(x => Math.Abs(x.UserSimilarityPoint));
                double result = 0;
                foreach (var predictionData in predictionDatas)
                {
                    result += (predictionData.UserNormalizeRating * predictionData.UserSimilarityPoint) / theBottom;
                }
                this.normalizedMatrix[predictionItemIndex, predictionUserIndex] = Rounding2DecimalPlace(result);
            }
            else
            {
                var predictionUserIndex = i;
                var predictionItemIndex = u;
                // predict the rating of user u for item i (normalized)
                // if you need the un

                // Step 1: find all users who rated i
                var ids = this.data.Where(x => x.RecipeId != u && x.UserId == i).Select(x => x.RecipeId).ToArray();
                // Step 2: 

                // Step 3: find similarity btw the current user and others who already rated i
                var predictionDatas = new ItemBasedPredictionData[ids.Count()];
                for (int index = 0; index < ids.Count(); index++)
                {
                    var similarityItemIndex = ids[index];
                    var similarityPoint = this.similarityMatrix[similarityItemIndex, predictionItemIndex];
                    predictionDatas[index] = new ItemBasedPredictionData
                    {
                        UserId = predictionUserIndex,
                        ItemId = ids[index],
                        ItemSimilarityPoint = similarityPoint,
                        ItemNormalizeRating = this.normalizedMatrix[ids[index], predictionUserIndex]
                    };
                }
                predictionDatas = predictionDatas.OrderByDescending(x => x.ItemSimilarityPoint).Take(this.k).ToArray();
                var theBottom = predictionDatas.Sum(x => Math.Abs(x.ItemSimilarityPoint));
                if (predictionDatas.Where(x => x.ItemSimilarityPoint == 0).FirstOrDefault() != null)
                {
                    theBottom = 1;
                }
                double result = 0;
                foreach (var predictionData in predictionDatas)
                {
                    result += (predictionData.ItemNormalizeRating * predictionData.ItemSimilarityPoint) / theBottom;
                }
                this.normalizedMatrix[predictionItemIndex, predictionUserIndex] = Rounding2DecimalPlace(result);
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="u"></param>
        /// <param name="i"></param>
        /// <param name="normalized"></param>
        public void Predict(int u, int i, int normalized = 1)
        {
            if (this.isUucf)
            {
                PrivatePredict(u, i, normalized);
            }
            else
            {
                PrivatePredict(i, u, normalized);
            }
        }
        public void RecommendItems(IRedisClient redisClient)
        {
            if (this.isUucf)
            {
                for (int userIndex = 0; userIndex < numberOfUsers; userIndex++)
                {
                    var recommended_items = new List<double>();
                    for (int itemIndex = 0; itemIndex < numberOfItems; itemIndex++)
                    {
                        if (this.normalizedMatrix[itemIndex, userIndex] == 0)
                        {
                            this.Predict(userIndex, itemIndex);
                            if (this.normalizedMatrix[itemIndex, userIndex] > 0)
                            {
                                redisClient.AddItemToSortedSet(redisRecommenderUserBased + userIndex, itemIndex.ToString(), this.normalizedMatrix[itemIndex, userIndex]);
                                recommended_items.Add(itemIndex);
                            }
                        }
                    }
                    Console.Write($"Recommend User {userIndex} - Item(s): ");
                    foreach (var recommended_item in recommended_items)
                    {
                        Console.Write(recommended_item + " ");
                    }
                    Console.WriteLine();
                }
                Console.WriteLine(this.normalizedMatrix);
            }
            else
            {
                for (int itemIndex = 0; itemIndex < numberOfItems; itemIndex++)
                {
                    var recommended_users = new List<double>();
                    for (int userIndex = 0; userIndex < numberOfUsers; userIndex++)
                    {
                        if (this.normalizedMatrix[itemIndex, userIndex] == 0)
                        {
                            this.Predict(userIndex, itemIndex);
                            if (this.normalizedMatrix[itemIndex, userIndex] > 0)
                            {
                                redisClient.AddItemToSortedSet(redisRecommenderItemBased+ itemIndex, userIndex.ToString(), this.normalizedMatrix[itemIndex, userIndex]);
                                recommended_users.Add(userIndex);
                            }
                        }
                    }
                    Console.Write($"Recommend item {itemIndex} for user(s) :");
                    foreach (var recommended_user in recommended_users)
                    {
                        Console.Write(recommended_user + " ");
                    }
                    Console.WriteLine();
                }
                Console.WriteLine(this.normalizedMatrix);
            }
        }
        private double Rounding2DecimalPlace(double number)
        {
            var output = Math.Round(number * 100) / 100;
            return output;
        }
    }
  


}
