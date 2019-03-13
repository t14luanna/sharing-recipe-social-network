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
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IRatingRecipeService : IBaseService<RatingRecipe, RatingRecipeViewModel>
    {
        Task<ICollection<RatingRecipeViewModel>> GetRatingComment(UserManager<SRSNUser> userManager, int recipeId);
    }

    public class RatingRecipeService : BaseService<RatingRecipe, RatingRecipeViewModel>, IRatingRecipeService
    {
        public RatingRecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task<ICollection<RatingRecipeViewModel>> GetRatingComment(UserManager<SRSNUser> userManager, int recipeId)
        {
            try
            {
                var list = new List<RatingRecipeViewModel>();
                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM RatingRecipe WHERE recipeId=" + recipeId + " ORDER BY CreateTime DESC").ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                    // apply automapper 
                    var ratingViewModel = this.EntityToVM(item);
                    // da co duoc du lieu cua entity trong view model cap nhat them vai field dac biet nhu la fullname chi viewmodel moi co
                    ratingViewModel.FullName = fullName;
                    ratingViewModel.AvatarUrl = currentUser.AvatarImageUrl;
                    list.Add(ratingViewModel);

                }
                return list;

            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
