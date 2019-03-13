using AutoMapper;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IUserReactionRecipeService : IBaseService<UserReactionRecipe, UserReactionRecipeViewModel>
    {
        Task<UserReactionRecipeViewModel> LikeRecipe(int userId, int recipeId);
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
                if(userReactionRecipeVM.RecipeId != 0 && userReactionRecipeVM.UserId != 0)
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
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
