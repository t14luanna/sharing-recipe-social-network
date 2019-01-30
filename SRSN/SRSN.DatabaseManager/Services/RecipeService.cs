using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public interface IRecipeService : IBaseService<Recipe, RecipeViewModel>
    {
        Task CreateRecipeWithSteps(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM);
        Task DeActiveRecipe(int id);
        Task UpdateRecipe(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM);
        Task<ICollection<RecipeViewModel>> GetAllRecipeByUserId(int userId);
    }

    public class RecipeService : BaseService<Recipe, RecipeViewModel>, IRecipeService
    {

        public RecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
        public async Task CreateRecipeWithSteps(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM)
        {
            // lay ra repository cua stepRecipeDbSet
            var stepRecipeDbSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            // O day chung ta can phai dung  Transaction vi phai tao Recipe truoc sau do moi tao step recipe 
            // => neu 1 trong cac buoc tren chet thi minh se rollback
            using (var transaction = await this.unitOfWork.GetDbTransaction())
            {
                try
                {
                    // Bien doi recipeVM => recipeEntity
                    var recipeEntity = this.VMToEntity(recipeVM);
                    recipeEntity.CreateTime = DateTime.Now;
                    recipeEntity.Active = true;
                    await this.selfDbSet.AddAsync(recipeEntity);
                    // Buoc nay cap nhat len db that de recipeEntity co duoc Id ( vi la id tu tang )
                    await this.unitOfWork.Commit();
                    // duyet het list step of recipes de add tung phan tu vao dbcontext
                    foreach (var sorVM in listSORVM)
                    {
                        var sorEntity = this.VMToEntity<StepsOfRecipe, StepsOfRecipeViewModel>(sorVM);
                        // dung dung step recipe repository de create va dung quen cap nhat Recipe Id cho Entity
                        sorEntity.RecipeId = recipeEntity.Id;
                        await stepRecipeDbSet.AddAsync(sorEntity);
                        // cap nhat lai dbcontext, moi duoc add list step of recipe len db
                        await this.unitOfWork.Commit();
                    }
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    // neu bi loi thi rollback va throw cho phia ngoai controller catch
                    transaction.Rollback();
                    throw ex;
                }
            }
        }
        public async Task DeActiveRecipe(int id)
        {
            var recipe = await this.selfDbSet.FindAsync(id);
            recipe.Active = false;
            this.selfDbSet.Update(recipe);
            await this.unitOfWork.Commit();
        }

        public async Task<ICollection<RecipeViewModel>> GetAllRecipeByUserId(int userId)
        {
            // lay ra step of recipe repository
            var stepOfRecipeRepo = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();

            var recipes = await this.Get(p => p.UserId == userId).ToListAsync();
            foreach(var recipe in recipes)
            {
                var stepOfRecipes = stepOfRecipeRepo.AsNoTracking().Where(p => p.RecipeId == recipe.Id);
                if(stepOfRecipeRepo.Count() > 0)
                {
                    recipe.ListSORVM = await stepOfRecipes.ProjectTo<StepsOfRecipeViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                }
            }
            return recipes;
        }
  
        public async Task UpdateRecipe(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM)
        {
            var stepRecipeDBSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            using (var transaction = await this.unitOfWork.GetDbTransaction())
            {
                try
                {
                    var recipeEntity = this.VMToEntity(recipeVM);
                    recipeEntity.UpdateTime = DateTime.Now;
                    this.selfDbSet.Update(recipeEntity);
                    await this.unitOfWork.Commit();
                    foreach (var sorVM in listSORVM)
                    {
                        var sorEntity = this.VMToEntity<StepsOfRecipe, StepsOfRecipeViewModel>(sorVM);
                        sorEntity.RecipeId = recipeEntity.Id;
                        stepRecipeDBSet.Update(sorEntity);
                        await this.unitOfWork.Commit();
                    }
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }
        }
    }
}
