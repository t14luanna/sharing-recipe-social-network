using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.Identities;
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
    public interface ICollectionPostService : IBaseService<CollectionPost, CollectionPostViewModel>
    {
        Task DeactiveAsync(int collectionid, int recipePostId);
        Task<ICollection<CollectionPostViewModel>> GetRecipeByCollectionId(UserManager<SRSNUser> userManager, int collectionId);
    }
    public class CollectionPostService : BaseService<CollectionPost, CollectionPostViewModel>, ICollectionPostService
    {
        public CollectionPostService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task DeactiveAsync(int collectionid, int recipePostId)
        {
            var trueEntity = selfDbSet.Where(q => q.CollectionId == collectionid && q.RecipePostId == recipePostId).FirstOrDefault();
            trueEntity.IsActive = false;
            this.selfDbSet.Update(trueEntity);

            await unitOfWork.CommitAsync();
        }

        public async Task<ICollection<CollectionPostViewModel>> GetRecipeByCollectionId(UserManager<SRSNUser> userManager, int collectionId)
        {
            try
            {
                var list = new List<CollectionPostViewModel>();
                var recipeRepo = this.unitOfWork.GetDbContext().Set<Recipe>();
                var recipesList = await this.Get(p => p.CollectionId == collectionId && p.IsActive == true).ToListAsync();
                foreach (var recipe in recipesList)
                {
                    var recipeItem = this.unitOfWork.GetDbContext().Set<Recipe>().Where(x => x.Id == recipe.RecipePostId).FirstOrDefault();
                    recipe.ImageCover = recipeItem.ImageCover;
                    recipe.RecipeName = recipeItem.RecipeName;
                    var userName = userManager.FindByIdAsync(recipeItem.UserId.ToString()).Result;
                    recipe.AuthorName = userName.UserName;
                    recipe.AvatarImageUrl = userName.AvatarImageUrl;
                    list.Add(recipe);
                }
                return list;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
