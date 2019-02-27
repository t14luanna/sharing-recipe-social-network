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
        Task CreateRecipeWithSteps(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
            , List<RecipeCategoryViewModel> listCategory);
        Task DeActiveRecipe(int id);
        Task UpdateRecipe(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory);
        Task<ICollection<RecipeViewModel>> GetAllRecipeByUserId(int userId);
       ICollection<RecipeViewModel> GetPopularRecipes();
       ICollection<RecipeViewModel> GetLastestRecipes();
    }

    public class RecipeService : BaseService<Recipe, RecipeViewModel>, IRecipeService
    {

        public RecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task CreateRecipeWithSteps(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory)
        {
            // lay ra repository cua stepRecipeDbSet
            var stepRecipeDbSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            var recipeIngredientDBSet = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
            var recipeCategoryDBSet = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
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
                    foreach (var ingredient in listIngredient)
                    {
                        var ingredientEntity = this.VMToEntity<RecipeIngredient, RecipeIngredientViewModel>(ingredient);
                        ingredientEntity.RecipeId = recipeEntity.Id;
                        await recipeIngredientDBSet.AddAsync(ingredientEntity);
                        await this.unitOfWork.Commit();
                    }
                    foreach (var category in listCategory)
                    {
                        var categoryEntity = this.VMToEntity<RecipeCategory, RecipeCategoryViewModel>(category);
                        categoryEntity.RecipeId = recipeEntity.Id;
                        await recipeCategoryDBSet.AddAsync(categoryEntity);
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
            try
            {
                var stepOfRecipeRepo = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
                var ingredientRepo = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
                var categoryRepo = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
                var recipes = await this.Get(p => p.UserId == userId).ToListAsync();
                foreach (var recipe in recipes)
                {
                    var stepOfRecipes = stepOfRecipeRepo.AsNoTracking().Where(p => p.RecipeId == recipe.Id);
                    var ingredient = ingredientRepo.AsNoTracking().Where(p => p.RecipeId == recipe.Id);
                    var category = categoryRepo.AsNoTracking().Where(p => p.RecipeId == recipe.Id);
                    if (stepOfRecipeRepo.Count() > 0)
                    {
                        recipe.ListSORVM = await stepOfRecipes.ProjectTo<StepsOfRecipeViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                    }
                    if (ingredientRepo.Count() > 0)
                    {
                        recipe.listIngredient = await ingredient.ProjectTo<RecipeIngredientViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                    }
                    if (categoryRepo.Count() > 0)
                    {
                        recipe.listCategory = await category.ProjectTo<RecipeCategoryViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                    }
                }
                return recipes;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ICollection<RecipeViewModel> GetPopularRecipes()
        {
            return this.Get().AsNoTracking().Where(r => r.Active == true).Take(4).ToList();
        }

        public ICollection<RecipeViewModel> GetLastestRecipes()
        {
            return this.Get().AsNoTracking().Where(r => r.Active == true).OrderBy(r => r.CreateTime).Take(4).ToList();
        }

        public async Task UpdateRecipe(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory)
        {
            var stepRecipeDBSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            var recipeIngredientDBSet = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
            var recipeCategoryDBSet = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
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
                    foreach (var ingredient in listIngredient)
                    {
                        var ingredientEntity = this.VMToEntity<RecipeIngredient, RecipeIngredientViewModel>(ingredient);
                        ingredientEntity.RecipeId = recipeEntity.Id;
                        recipeIngredientDBSet.Update(ingredientEntity);
                        await this.unitOfWork.Commit();
                    }
                    foreach (var category in listCategory)
                    {
                        var categoryEntity = this.VMToEntity<RecipeCategory, RecipeCategoryViewModel>(category);
                        categoryEntity.RecipeId = recipeEntity.Id;
                        recipeCategoryDBSet.Update(categoryEntity);
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
