using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IUserReactionRecipeService : IBaseService<UserReactionRecipe, UserReactionRecipeViewModel>
    {
        Task<UserReactionRecipeViewModel> LikeRecipe(int userId, int recipeId);
        Task<UserReactionRecipeViewModel> ViewRecipe(int userId, int recipeId);
        Task<bool> CreateRatingRecipe(UserReactionRecipeViewModel userreactionVM);
        Task<int> CommentCount( int recipeId);
        Task<Object> LikeShareCount( int recipeId);
        Task UpdateRecipeRating(int recipeId, double ratingRecipe);
    }
    public class UserReactionRecipeService : BaseService<UserReactionRecipe, UserReactionRecipeViewModel>, IUserReactionRecipeService
    {
        public UserReactionRecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {



        }

        public async Task<UserReactionRecipeViewModel> LikeRecipe(int userId, int recipeId)
        {
            var userReactionRecipeVM = await this.FirstOrDefaultAsync(x => x.RecipeId == recipeId && x.UserId == userId);
            try
            {
                if (userReactionRecipeVM!=null)
                {
                    if (userReactionRecipeVM.RecipeId != 0 && userReactionRecipeVM.UserId != 0)
                    {
                        if (userReactionRecipeVM.IsLike.HasValue)
                            userReactionRecipeVM.IsLike = !userReactionRecipeVM.IsLike;
                        else
                            userReactionRecipeVM.IsLike = true;
                        await this.UpdateAsync(userReactionRecipeVM);
                        return userReactionRecipeVM;
                    }
                    else
                    {
                        var creatingUserReactionRecipeVM = new UserReactionRecipeViewModel()
                        {
                            UserId = userId,
                            RecipeId = recipeId,
                            IsLike = true
                        };
                        await this.CreateAsync(creatingUserReactionRecipeVM);
                        return creatingUserReactionRecipeVM;
                    }
                }
                else
                {
                    var creatingUserReactionRecipeVM = new UserReactionRecipeViewModel()
                    {
                        UserId = userId,
                        RecipeId = recipeId,
                        IsLike = true
                    };
                    await this.CreateAsync(creatingUserReactionRecipeVM);
                    return creatingUserReactionRecipeVM;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<UserReactionRecipeViewModel> ViewRecipe(int userId, int recipeId)
        {
            var userReactionRecipeVM = await this.FirstOrDefaultAsync(x => x.RecipeId == recipeId && x.UserId == userId);
            try
            {
                if (userReactionRecipeVM != null)
                {
                    if (userReactionRecipeVM.RecipeId != 0 && userReactionRecipeVM.UserId != 0)
                    {
                        if(!userReactionRecipeVM.IsView.HasValue || userReactionRecipeVM.IsView.Value == false)
                        {
                            userReactionRecipeVM.IsView = true;
                        }
                        if (userReactionRecipeVM.TotalView == null)
                        {
                            userReactionRecipeVM.TotalView = 0;
                        }
                        userReactionRecipeVM.TotalView += 1;
                        await this.UpdateAsync(userReactionRecipeVM);
                        return userReactionRecipeVM;
                    }
                    else
                    {
                        var creatingUserReactionRecipeVM = new UserReactionRecipeViewModel()
                        {
                            UserId = userId,
                            RecipeId = recipeId,
                            IsView = true,
                            TotalView = 1,
                        };
                        await this.CreateAsync(creatingUserReactionRecipeVM);
                        return creatingUserReactionRecipeVM;
                    }
                }
                else
                {
                    var creatingUserReactionRecipeVM = new UserReactionRecipeViewModel()
                    {
                        UserId = userId,
                        RecipeId = recipeId,
                        IsView = true,
                        TotalView = 1,
                    };
                    await this.CreateAsync(creatingUserReactionRecipeVM);
                    return creatingUserReactionRecipeVM;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task UpdateRecipeRating(int recipeId, double ratingRecipe)
        {
            var recipeDbset = this.unitOfWork.GetDbContext().Set<Recipe>();
            var recipe = await recipeDbset.FindAsync(recipeId);
            var recipeEvRating = recipeDbset.Where(p => p.Id == recipeId).FirstOrDefault().EvRating;
            double newRecipeRating = 0;
            if (recipeEvRating.Value == 0 || recipeEvRating.Value == null)
            {
                newRecipeRating = ratingRecipe;
            }
            else
            {
                newRecipeRating = (recipeEvRating.Value + ratingRecipe) / 2;
            }
            recipe.EvRating = newRecipeRating;
            recipeDbset.Update(recipe);
            await this.unitOfWork.CommitAsync();

        }

        public async Task<int> CommentCount(int recipeId)
        {
            var recipeDbset = this.unitOfWork.GetDbContext().Set<Comment>();
            var recipe = await recipeDbset.FindAsync(recipeId);
            var commentCount = recipeDbset.Where(p => p.RecipeId == recipeId).Count();
            return commentCount;
        }

        public async Task<Object> LikeShareCount(int recipeId)
        {
            var countList = new List<int>();
            var recipeDbset = this.unitOfWork.GetDbContext().Set<Recipe>();
            var commentDbset = this.unitOfWork.GetDbContext().Set<Comment>();
            var recipe = await recipeDbset.FindAsync(recipeId);
            var like = this.Get(x => x.RecipeId == recipeId && x.IsLike == true).Count();
            var share = recipeDbset.Where(x => x.ReferencedRecipeId == recipeId && x.Active == true).Count();
            var commentCount = commentDbset.Where(p => p.RecipeId == recipeId).Count();
            return (new {
                success = true,
                likeCount = like,
                shareCount = share,
                commentCount = commentCount
            });
        }

        public async Task<bool> CreateRatingRecipe(UserReactionRecipeViewModel request)
        {
            if (request.RatingRecipe == null || request.RatingRecipe == 0)
            {
                return false;
            }
            var existingUserReaction = await this.FirstOrDefaultAsync(x => x.UserId == request.UserId && x.RecipeId == request.RecipeId);
            request.RatingTime = DateTime.UtcNow.AddHours(7);
            if (existingUserReaction == null)
            {
                await this.CreateAsync(request);
            }
            else
            {
                if (existingUserReaction.RatingRecipe == null)
                {
                    existingUserReaction.RatingRecipe = request.RatingRecipe.Value;
                    existingUserReaction.RatingContent = request.RatingContent;
                    existingUserReaction.RatingTime = request.RatingTime;
                    await this.UpdateAsync(existingUserReaction);
                }
                else
                {
                    return false;
                }
            }
            await this.UpdateRecipeRating(request.RecipeId, request.RatingRecipe.Value);
            return true;
        }
    }
}
