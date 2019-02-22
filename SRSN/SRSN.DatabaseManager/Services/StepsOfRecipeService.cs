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
    public interface IStepsOfRecipeService: IBaseService<StepsOfRecipe, CategoryItemViewModel>
    {
        Task<ICollection<CategoryItemViewModel>> GetStepsOfRecipe(int recipeId);
    }
    public class StepsOfRecipeService : BaseService<StepsOfRecipe, CategoryItemViewModel>, IStepsOfRecipeService
    {
        public StepsOfRecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task<ICollection<CategoryItemViewModel>> GetStepsOfRecipe(int recipeId)
        {
            try
            {
                var list = new List<CategoryItemViewModel>();

                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM StepsOfRecipe WHERE RecipeId="+recipeId +" ORDER BY Id ASC").ToList();
                foreach (var item in listItems)
                {

                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);

                    list.Add(recipeViewModel);

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
