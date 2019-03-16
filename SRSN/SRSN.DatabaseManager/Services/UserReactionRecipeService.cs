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
                            await this.UpdateAsync(userReactionRecipeVM);
                        }
                        return userReactionRecipeVM;
                    }
                    else
                    {
                        var creatingUserReactionRecipeVM = new UserReactionRecipeViewModel()
                        {
                            UserId = userId,
                            RecipeId = recipeId,
                            IsView = true
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
                        IsView = true
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
            double newRecipeRating = (recipeEvRating.Value + ratingRecipe) / 2;
            recipe.EvRating = newRecipeRating;
            recipeDbset.Update(recipe);
            await this.unitOfWork.CommitAsync();

        }
    }
}
