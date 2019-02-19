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
    public interface IRecipeIngredientService : IBaseService<RecipeIngredient, RecipeIngredientViewModel>
    {
        Task<ICollection<RecipeIngredientViewModel>> GetRecipeIngredients(int recipeId);
    }
    public class RecipeIngredientService : BaseService<RecipeIngredient, RecipeIngredientViewModel>, IRecipeIngredientService
    {
        public RecipeIngredientService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
        public async Task<ICollection<RecipeIngredientViewModel>> GetRecipeIngredients(int recipeId)
        {
            var list = new List<RecipeIngredientViewModel>();
            // lay ra step of recipe repository
            try { 
            
                // get list ingredient of recipeId
                var listIngredients = selfDbSet
                    .AsNoTracking()
                    .Where(p => p.RecipeId == recipeId);

                foreach (var item in listIngredients)
                {
                    //automapping
                    var recipeIngredientViewModel = this.EntityToVM(item);
                    list.Add(recipeIngredientViewModel);
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
