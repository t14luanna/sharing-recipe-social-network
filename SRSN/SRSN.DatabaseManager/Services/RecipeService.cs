using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public interface IRecipeService : IBaseService<Recipe, RecipeViewModel>
    {
        Task CreateRecipeWithStepsAsync(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
            , List<RecipeCategoryViewModel> listCategory);
        void CreateRecipeWithSteps(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
      , List<RecipeCategoryViewModel> listCategory);
        Task DeActiveRecipe(int id);
        Task UpdateRecipe(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory);
        Task<ICollection<RecipeViewModel>> GetAllRecipeByUserId(int userId);
        Task<ICollection<RecipeViewModel>> GetAllIngredientByRecipeId(int recipeId);
        Task<ICollection<RecipeViewModel>> GetPopularRecipes(UserManager<SRSNUser> userManager);
        Task<ICollection<RecipeViewModel>> GetLatestRecipes(UserManager<SRSNUser> userManager);
        Task<ICollection<RecipeViewModel>> Get1000LatestRecipes(UserManager<SRSNUser> userManager);
        Task<ICollection<RecipeViewModel>> GetRandomRecipes(UserManager<SRSNUser> userManager);
        Task<ICollection<RecipeViewModel>> GetRecipeWithID(UserManager<SRSNUser> userManager, int recipeId);
        Task<ICollection<RecipeViewModel>> GetRelatedRecipe(int userId);
        ICollection<RecipeViewModel> GetPopularRecipes();
        ICollection<RecipeViewModel> GetLastestRecipes();
        Task<ICollection<RecipeViewModel>> GetRecipeNameLike(string recipeName);
    }


    public class RecipeService : BaseService<Recipe, RecipeViewModel>, IRecipeService
    {

        public RecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task CreateRecipeWithStepsAsync(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
            , List<RecipeCategoryViewModel> listCategory)
        {
            // lay ra repository cua stepRecipeDbSet
            var stepRecipeDbSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            var recipeIngredientDBSet = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
            var recipeCategoryDBSet = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
            // O day chung ta can phai dung  Transaction vi phai tao Recipe truoc sau do moi tao step recipe 
            // => neu 1 trong cac buoc tren chet thi minh se rollback
            using (var transaction = await this.unitOfWork.GetDbTransactionAsync())
            {
                try
                {
                    // Bien doi recipeVM => recipeEntity
                    var recipeEntity = this.VMToEntity(recipeVM);
                    recipeEntity.CreateTime = DateTime.Now;
                    recipeEntity.Active = true;
                    await this.selfDbSet.AddAsync(recipeEntity);
                    // Buoc nay cap nhat len db that de recipeEntity co duoc Id ( vi la id tu tang )
                    await this.unitOfWork.CommitAsync();
                    // duyet het list step of recipes de add tung phan tu vao dbcontext
                    foreach (var sorVM in listSORVM)
                    {
                        var sorEntity = this.VMToEntity<StepsOfRecipe, StepsOfRecipeViewModel>(sorVM);
                        // dung dung step recipe repository de create va dung quen cap nhat Recipe Id cho Entity
                        sorEntity.RecipeId = recipeEntity.Id;
                        await stepRecipeDbSet.AddAsync(sorEntity);
                        // cap nhat lai dbcontext, moi duoc add list step of recipe len db
                        await this.unitOfWork.CommitAsync();
                    }
                    foreach (var ingredient in listIngredient)
                    {
                        var ingredientEntity = this.VMToEntity<RecipeIngredient, RecipeIngredientViewModel>(ingredient);
                        ingredientEntity.RecipeId = recipeEntity.Id;
                        await recipeIngredientDBSet.AddAsync(ingredientEntity);
                        await this.unitOfWork.CommitAsync();
                    }
                    foreach (var category in listCategory)
                    {
                        var categoryEntity = this.VMToEntity<RecipeCategory, RecipeCategoryViewModel>(category);
                        categoryEntity.RecipeId = recipeEntity.Id;
                        await recipeCategoryDBSet.AddAsync(categoryEntity);
                        await this.unitOfWork.CommitAsync();
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
            await this.unitOfWork.CommitAsync();
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
        public async Task<ICollection<RecipeViewModel>> GetAllIngredientByRecipeId(int recipeId)
        {
            // lay ra step of recipe repository
            try
            {
                var stepOfRecipeRepo = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
                var ingredientRepo = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
                var recipes = await this.Get(p => p.Id == recipeId).ToListAsync();

                foreach (var recipe in recipes)
                {
                    var stepOfRecipes = stepOfRecipeRepo.AsNoTracking().Where(p => p.RecipeId == recipeId);
                    var ingredient = ingredientRepo.AsNoTracking().Where(p => p.RecipeId == recipeId);

                    if (stepOfRecipeRepo.Count() > 0)
                    {
                        recipe.ListSORVM = await stepOfRecipes.ProjectTo<StepsOfRecipeViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                    }
                    if (ingredientRepo.Count() > 0)
                    {
                        recipe.listIngredient = await ingredient.ProjectTo<RecipeIngredientViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                    }

                }
                return recipes;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public async Task<ICollection<RecipeViewModel>> GetPopularRecipes(UserManager<SRSNUser> userManager)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                // hien tai o day dang dung trong 1 action cua service
                // khong nen dung ham cua service de su dung nen dung Repository 
                // o day la dbSet cua chinh ban than no
                // 
                // 1. dung this.Get() nghia la dang dung cua service hien hanh` va listItems se chua toan bo la ViewModel xuong duoi ban 1 lan nua lai mapping cho 1 viewmodel khac là sai
                // 2. nen dung dbSet ( nghia la repository de ma query )
                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT TOP 13 * FROM Recipe WHERE Active = 'True'  ORDER BY EvRating DESC, ViewQuantity DESC").ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);
                    // da co duoc du lieu cua entity trong view model cap nhat them vai field dac biet nhu la fullname chi viewmodel moi co
                    recipeViewModel.FullName = fullName;
                    list.Add(recipeViewModel);

                }
                return list;


            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<ICollection<RecipeViewModel>> GetLatestRecipes(UserManager<SRSNUser> userManager)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                // hien tai o day dang dung trong 1 action cua service
                // khong nen dung ham cua service de su dung nen dung Repository 
                // o day la dbSet cua chinh ban than no
                // 
                // 1. dung this.Get() nghia la dang dung cua service hien hanh` va listItems se chua toan bo la ViewModel xuong duoi ban 1 lan nua lai mapping cho 1 viewmodel khac là sai
                // 2. nen dung dbSet ( nghia la repository de ma query )
                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT TOP 11 * FROM RECIPE WHERE Active='1' ORDER BY CreateTime DESC").ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);
                    // da co duoc du lieu cua entity trong view model cap nhat them vai field dac biet nhu la fullname chi viewmodel moi co
                    recipeViewModel.FullName = fullName;
                    list.Add(recipeViewModel);

                }
                return list;

            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<ICollection<RecipeViewModel>> Get1000LatestRecipes(UserManager<SRSNUser> userManager)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                // hien tai o day dang dung trong 1 action cua service
                // khong nen dung ham cua service de su dung nen dung Repository 
                // o day la dbSet cua chinh ban than no
                // 
                // 1. dung this.Get() nghia la dang dung cua service hien hanh` va listItems se chua toan bo la ViewModel xuong duoi ban 1 lan nua lai mapping cho 1 viewmodel khac là sai
                // 2. nen dung dbSet ( nghia la repository de ma query )
                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT TOP 1000 * FROM RECIPE WHERE Active='1' ORDER BY CreateTime DESC").ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);
                    // da co duoc du lieu cua entity trong view model cap nhat them vai field dac biet nhu la fullname chi viewmodel moi co
                    recipeViewModel.FullName = fullName;
                    list.Add(recipeViewModel);

                }
                return list;


            }
            catch (Exception ex)
            {
                return null;
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
            using (var transaction = await this.unitOfWork.GetDbTransactionAsync())
            {
                try
                {
                    var recipeEntity = this.VMToEntity(recipeVM);
                    recipeEntity.UpdateTime = DateTime.Now;
                    this.selfDbSet.Update(recipeEntity);
                    await this.unitOfWork.CommitAsync();
                    foreach (var sorVM in listSORVM)
                    {
                        var sorEntity = this.VMToEntity<StepsOfRecipe, StepsOfRecipeViewModel>(sorVM);
                        sorEntity.RecipeId = recipeEntity.Id;
                        stepRecipeDBSet.Update(sorEntity);
                        await this.unitOfWork.CommitAsync();
                    }
                    foreach (var ingredient in listIngredient)
                    {
                        var ingredientEntity = this.VMToEntity<RecipeIngredient, RecipeIngredientViewModel>(ingredient);
                        ingredientEntity.RecipeId = recipeEntity.Id;
                        recipeIngredientDBSet.Update(ingredientEntity);
                        await this.unitOfWork.CommitAsync();
                    }
                    foreach (var category in listCategory)
                    {
                        var categoryEntity = this.VMToEntity<RecipeCategory, RecipeCategoryViewModel>(category);
                        categoryEntity.RecipeId = recipeEntity.Id;
                        recipeCategoryDBSet.Update(categoryEntity);
                        await this.unitOfWork.CommitAsync();
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

        public async Task<ICollection<RecipeViewModel>> GetRandomRecipes(UserManager<SRSNUser> userManager)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                var listItems = this.selfDbSet.AsNoTracking().FromSql("Select top 6 * from Recipe order by NEWID()").Where(a => a.Active == true).ToList();
                foreach (var item in listItems)
                {
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);

                    recipeViewModel.FullName = fullName;
                    list.Add(recipeViewModel);

                }
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<ICollection<RecipeViewModel>> GetRecipeWithID(UserManager<SRSNUser> userManager, int recipeId)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                var listItems = this.selfDbSet.AsNoTracking().FromSql("select * from Recipe where Id=" + recipeId + " and Active='1'").ToList();
                foreach (var item in listItems)
                {
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";
                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);

                    recipeViewModel.FullName = fullName;
                    list.Add(recipeViewModel);

                }
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ICollection<RecipeViewModel>> GetRelatedRecipe(int userId)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT top 3 * FROM Recipe WHERE UserId=" + userId + " and Active='1' order by NEWID()").ToList();
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

        public void CreateRecipeWithSteps(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
        , List<RecipeCategoryViewModel> listCategory)
        {
            // lay ra repository cua stepRecipeDbSet
            var stepRecipeDbSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            var recipeIngredientDBSet = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
            var recipeCategoryDBSet = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
            // O day chung ta can phai dung  Transaction vi phai tao Recipe truoc sau do moi tao step recipe 
            // => neu 1 trong cac buoc tren chet thi minh se rollback
            using (var transaction = this.unitOfWork.GetDbTransaction())
            {
                try
                {
                    // Bien doi recipeVM => recipeEntity
                    var recipeEntity = this.VMToEntity(recipeVM);
                    recipeEntity.CreateTime = DateTime.Now;
                    recipeEntity.Active = true;
                    this.selfDbSet.Add(recipeEntity);
                    // Buoc nay cap nhat len db that de recipeEntity co duoc Id ( vi la id tu tang )
                    this.unitOfWork.Commit();
                    // duyet het list step of recipes de add tung phan tu vao dbcontext
                    foreach (var sorVM in listSORVM)
                    {
                        var sorEntity = this.VMToEntity<StepsOfRecipe, StepsOfRecipeViewModel>(sorVM);
                        // dung dung step recipe repository de create va dung quen cap nhat Recipe Id cho Entity
                        sorEntity.RecipeId = recipeEntity.Id;
                        stepRecipeDbSet.Add(sorEntity);
                        // cap nhat lai dbcontext, moi duoc add list step of recipe len db
                        this.unitOfWork.Commit();
                    }
                    foreach (var ingredient in listIngredient)
                    {
                        var ingredientEntity = this.VMToEntity<RecipeIngredient, RecipeIngredientViewModel>(ingredient);
                        ingredientEntity.RecipeId = recipeEntity.Id;
                        recipeIngredientDBSet.AddAsync(ingredientEntity);
                        this.unitOfWork.Commit();
                    }
                    foreach (var category in listCategory)
                    {
                        var categoryEntity = this.VMToEntity<RecipeCategory, RecipeCategoryViewModel>(category);
                        categoryEntity.RecipeId = recipeEntity.Id;
                        recipeCategoryDBSet.AddAsync(categoryEntity);
                        this.unitOfWork.Commit();
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

        public async Task<ICollection<RecipeViewModel>> GetRecipeNameLike(string recipeName)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT top 3 * FROM Recipe WHERE RecipeName LIKE '%" + recipeName + "%' order by Id DESC").ToList();
                foreach (var item in listItems)
                {
                    //apply automapper
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






