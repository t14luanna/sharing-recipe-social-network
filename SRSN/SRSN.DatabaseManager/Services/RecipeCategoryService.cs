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
    public interface IRecipeCategoryService : IBaseService<RecipeCategory, RecipeCategoryViewModel>
    {
        Task<ICollection<RecipeCategoryViewModel>> GetListRecipeCategory(int recipeId);
    }

    public class RecipeCategoryService : BaseService<RecipeCategory, RecipeCategoryViewModel>, IRecipeCategoryService
    {
        public RecipeCategoryService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task<ICollection<RecipeCategoryViewModel>> GetListRecipeCategory(int recipeId)
        {
            try
            {
                var list = new List<RecipeCategoryViewModel>();
                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM Recipe_Category WHERE RecipeId=" + recipeId).ToList();
                foreach (var item in listItems)
                {
                    var viewModel = this.EntityToVM(item);
                    list.Add(viewModel);
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