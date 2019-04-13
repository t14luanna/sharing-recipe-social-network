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
    public interface IUserReportRecipeService : IBaseService<UserReportRecipe, UserReportRecipeViewModel>
    {
        Task<ICollection<UserReportRecipeViewModel>> GetAllReportedRecipe(UserManager<SRSNUser> userManager);
        Task<UserReportRecipeViewModel> DeActiveRecipeReport(int id);
    }

    public class UserReportRecipeService : 
        BaseService<UserReportRecipe, UserReportRecipeViewModel>,
        IUserReportRecipeService
    {

        public UserReportRecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {

        }

        public async Task<ICollection<UserReportRecipeViewModel>> GetAllReportedRecipe(UserManager<SRSNUser> userManager)
        {
            /*var listReport = new List<UserReportUserViewModel>();
            var listReportEntity = this.selfDbSet.AsNoTracking().OrderByDescending(p => p.CreateTime).ToList();
            foreach (var item in listReportEntity)
            {
                var username = userManager.FindByIdAsync(item.UserId.ToString()).Result.UserName;
                var reportedRecipe = userManager.FindByIdAsync(item.RecipeReportedId.ToString()).Result;
                var reportedUsername = reportedUser;
                //var statusOfReportedUser = reportedUser.isActive;
                var userReportedUserVM = this.EntityToVM(item);
                userReportedUserVM.Username = username;
                userReportedUserVM.ReportedUsername = reportedUsername;
                listReport.Add(userReportedUserVM);
            }
            return listReport;*/
            
            try
            {
                var listReported = new List<UserReportRecipeViewModel>();
                var listItems = this.selfDbSet.AsNoTracking().ToList();
                foreach (var item in listItems)
                {
                    var userName = userManager.FindByIdAsync(item.UserId.ToString()).Result.UserName;
                    var recipeName = this.unitOfWork.GetDbContext().Set<Recipe>().AsNoTracking().Where(recipe => recipe.Id == item.RecipeReportedId).Single().RecipeName;
                    var data = new UserReportRecipeViewModel();
                    data.Description = item.Description;
                    data.Id = item.Id;
                    data.UserId = item.UserId;
                    data.Username = userName;
                    data.RecipeReportedId = item.RecipeReportedId;
                    data.IsActive = item.IsActive;
                    data.CreateTime = item.CreateTime;
                    data.RecipeReported = recipeName;
                    listReported.Add(data);
                }
                

                return listReported;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<UserReportRecipeViewModel> DeActiveRecipeReport(int id)
        {
            var recipe = await this.selfDbSet.FindAsync(id);
            recipe.IsActive = !recipe.IsActive;
            this.selfDbSet.Update(recipe);
            await this.unitOfWork.CommitAsync();
            return this.EntityToVM(recipe);
        }

    }
}
