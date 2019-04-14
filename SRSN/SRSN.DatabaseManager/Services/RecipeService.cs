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
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SRSN.DatabaseManager.Services
{
    public interface IRecipeService : IBaseService<Recipe, RecipeViewModel>
    {
        /// <summary>
        /// Create Recipe with constraints
        /// then return recipe id
        /// </summary>
        /// <param name="recipeVM"></param>
        /// <param name="listSORVM"></param>
        /// <param name="listIngredient"></param>
        /// <param name="listCategory"></param>
        /// <returns></returns>
        Task<int> CreateRecipeWithStepsAndResultAsync(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
            , List<RecipeCategoryViewModel> listCategory);
        Task CreateRecipeWithStepsAsync(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
            , List<RecipeCategoryViewModel> listCategory);
        void CreateRecipeWithSteps(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient
        , List<RecipeCategoryViewModel> listCategory);
        Task DeActiveRecipe(int id);
        Task UpdateRecipe(int recipeId, RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory);
        Task UpdateRecipeSaveDraft(int recipeId, RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory);
        Task<ICollection<RecipeViewModel>> GetAllRecipeByUserId(int userId);
        Task<ICollection<RecipeViewModel>> GetAllRecipeByUserIdOrderbyTime(int userId);
        Task<ICollection<RecipeViewModel>> GetAllDraftRecipeByUserIdOrderbyTime(int userId);
        Task<ICollection<RecipeViewModel>> GetRecipeById(int recipeId);
        Task<ICollection<RecipeViewModel>> GetPopularRecipes(UserManager<SRSNUser> userManager);
        Task<ICollection<RecipeViewModel>> GetLatestRecipes(UserManager<SRSNUser> userManager);
        Task<ICollection<RecipeViewModel>> GetAllLatestRecipes(UserManager<SRSNUser> userManager, int limit, int page);
        Task<ICollection<RecipeViewModel>> GetRandomRecipes(UserManager<SRSNUser> userManager);
        Task<ICollection<RecipeViewModel>> GetRecipeWithID(UserManager<SRSNUser> userManager, int recipeId);
        Task<ICollection<RecipeViewModel>> GetDraftRecipeWithID(UserManager<SRSNUser> userManager, int recipeId);
        Task<ICollection<RecipeViewModel>> GetRelatedRecipe(int userId);
        ICollection<RecipeViewModel> GetPopularRecipes();
        ICollection<RecipeViewModel> GetLastestRecipes();
        Task<ICollection<RecipeViewModel>> GetRecipeNameLike(string recipeName);
        Task<ICollection<RecipeViewModel>> GetRecipeName(UserManager<SRSNUser> userManager, string recipeName);
        Task<ICollection<RecipeViewModel>> GetRecipeBaseOnCategory(UserManager<SRSNUser> userManager, string categoryName);
        Task UpdateIsShareReaction(int recipeId, int userId);
        Task<RecipeViewModel> getBestRecipeOfUser(int userId);
        Task<ICollection<RecipeViewModel>> GetTimeLineRecipes(UserManager<SRSNUser> userManager, int userId, int limit, int page);


    }


    public class RecipeService : BaseService<Recipe, RecipeViewModel>, IRecipeService
    {
        IRecipeCategoryService recipeCategoryService;

        public RecipeService(IUnitOfWork unitOfWork, IMapper mapper, IRecipeCategoryService recipeCategoryService) : base(unitOfWork, mapper)
        {
            this.recipeCategoryService = recipeCategoryService;
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
            recipe.SaveDraft = false;
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
                var recipes = await this.Get(p => p.UserId == userId && p.Active == true).ToListAsync();
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
        public async Task<ICollection<RecipeViewModel>> GetRecipeById(int recipeId)
        {
            // lay ra step of recipe repository
            try
            {
                var stepOfRecipeRepo = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
                var recipeCategoryRepo = this.unitOfWork.GetDbContext().Set<RecipeCategory>();//lấy danh sach id
                var categoryItemRepo = this.unitOfWork.GetDbContext().Set<CategoryItem>();
                var ingredientRepo = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
                var recipes = await this.Get(p => p.Id == recipeId).ToListAsync();

                foreach (var recipe in recipes)
                {
                    var stepOfRecipes = stepOfRecipeRepo.AsNoTracking().Where(p => p.RecipeId == recipeId);
                    var ingredients = ingredientRepo.AsNoTracking().Where(p => p.RecipeId == recipeId);
                    var recipeCategoryIds = recipeCategoryRepo.AsNoTracking().Where(p => p.RecipeId == recipeId);//list cate item id trong recipe_category table

                    if (stepOfRecipeRepo.Count() > 0)
                    {
                        recipe.ListSORVM = await stepOfRecipes.ProjectTo<StepsOfRecipeViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                    }
                    if (ingredientRepo.Count() > 0)
                    {
                        recipe.listIngredient = await ingredients.ProjectTo<RecipeIngredientViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                    }
                    if (categoryItemRepo.Count() > 0)
                    {
                        recipe.listCategory = await recipeCategoryIds.ProjectTo<RecipeCategoryViewModel>(this.mapper.ConfigurationProvider).ToListAsync();
                        foreach (var cateItem in recipe.listCategory)
                        {
                            var cateItemName = categoryItemRepo.AsNoTracking().Where(p => p.Id == cateItem.CategoryItemId).ProjectTo<CategoryItemViewModel>(this.mapper.ConfigurationProvider).FirstOrDefault().CategoryItemName;
                            cateItem.CategoryItemName = cateItemName;
                        }
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
                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT TOP 13 * FROM Recipe WHERE Active = 'True' AND ReferencedRecipeId IS NULL  ORDER BY EvRating DESC, ViewQuantity DESC").ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";
                    var username = currentUser.UserName;
                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);
                    // da co duoc du lieu cua entity trong view model cap nhat them vai field dac biet nhu la fullname chi viewmodel moi co
                    recipeViewModel.FullName = fullName;
                    recipeViewModel.Username = username;
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
                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT TOP 11 * FROM RECIPE WHERE Active='1' AND ReferencedRecipeId IS NULL ORDER BY CreateTime DESC").ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    if (item.UserId != null)
                    {
                        var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                        var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                        // apply automapper 
                        var recipeViewModel = this.EntityToVM(item);
                        // da co duoc du lieu cua entity trong view model cap nhat them vai field dac biet nhu la fullname chi viewmodel moi co
                        recipeViewModel.FullName = fullName;
                        list.Add(recipeViewModel);
                    }

                }
                return list;

            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<ICollection<RecipeViewModel>> GetAllLatestRecipes(UserManager<SRSNUser> userManager, int limit, int page)
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
                //var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT TOP 1000 * FROM RECIPE WHERE Active='1'AND ReferencedRecipeId IS NULL ORDER BY CreateTime DESC").ToList();
                var listItems = this.selfDbSet.AsNoTracking().Where(r => r.Active == true && r.ReferencedRecipeId == null).OrderByDescending(p => p.CreateTime).ToList();
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
                list = list.Skip(page * limit).Take(limit).ToList();
                return list;
                //var list = new List<RecipeViewModel>();
                //var listItems = this.Get().AsNoTracking().Where(r => r.Active == true && r.UserId == userId).OrderByDescending(x => x.CreateTime).ToList();
                //foreach (var item in listItems)
                //{
                //    var recipeUserID = await userManager.FindByIdAsync(userId.ToString());
                //    item.AccountVM = new AccountViewModel();
                //    mapper.Map(recipeUserID, item.AccountVM);
                //    list.Add(item);
                //}
                //list = list.Skip(page * limit).Take(limit).ToList();
                //return list;


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

        public async Task UpdateRecipe(int recipeId, RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory)
        {
            var stepRecipeDBSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            var recipeIngredientDBSet = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
            var recipeCategoryDBSet = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
            using (var transaction = await this.unitOfWork.GetDbTransactionAsync())
            {
                try
                {
                    var recipeEntity = this.VMToEntity(recipeVM);
                    // recipeEntity.Id = recipeId;
                    recipeEntity.Id = recipeId;
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
                    var recipeCategoryList = this.recipeCategoryService.GetListRecipeCategory(recipeId).Result.ToList();
                    for (var i = 0; i < recipeCategoryList.Count; i++)
                    {
                        bool isFound = false;
                        for (var j = 0; j < listCategory.Count; j++)
                        {
                            if(recipeCategoryList[i].Id == listCategory[j].Id)
                            {
                                isFound = true;
                            }
                        }
                        if(!isFound)
                        {
                            Debug.WriteLine("Removed record | " + recipeCategoryList[i].RecipeId + " | " + recipeCategoryList[i].CategoryItemId);
                            RecipeCategory rc = new RecipeCategory();
                            recipeCategoryDBSet.Remove(
                                this.VMToEntity<RecipeCategory, 
                                RecipeCategoryViewModel>(recipeCategoryList[i])
                            );
                            await this.unitOfWork.CommitAsync();
                        }
                    }
                    foreach (var recipeCategory in listCategory)
                    {
                        if (recipeCategory.Id == 0)
                        {
                            Debug.WriteLine("New record | " + recipeCategory.RecipeId + " | " + recipeCategory.CategoryItemId);
                            var rc = this.VMToEntity<RecipeCategory, RecipeCategoryViewModel>(recipeCategory);
                            await recipeCategoryDBSet.AddAsync(rc);
                            this.unitOfWork.Commit();
                        }
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

                var listItems = this.selfDbSet.AsNoTracking().FromSql("Select top 6 * from Recipe order by NEWID()").Where(a => a.Active == true && a.ReferencedRecipeId == null).ToList();
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

                    var accountVM = new AccountViewModel();
                    mapper.Map(currentUser, accountVM);

                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);

                    recipeViewModel.FullName = fullName;
                    recipeViewModel.AccountVM = accountVM;
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

                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT top 3 * FROM Recipe WHERE UserId=" + userId + " and Active='1'  AND ReferencedRecipeId IS NULL  order by NEWID()").ToList();
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

                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT top 3 * FROM Recipe WHERE RecipeName LIKE N'%" + recipeName + "%' order by Id DESC").ToList();
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

        public async Task<ICollection<RecipeViewModel>> GetRecipeName(UserManager<SRSNUser> userManager, string recipeName)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                var listItems = this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM Recipe WHERE RecipeName LIKE N'%" + recipeName + "%' order by Id DESC").ToList();
                foreach (var item in listItems)
                {
                    //apply automapper
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";
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

        public async Task<ICollection<RecipeViewModel>> GetRecipeBaseOnCategory(UserManager<SRSNUser> userManager, string categoryName)
        {
            try
            {
                var list = new List<RecipeViewModel>();
                var listItems = this.selfDbSet.AsNoTracking().FromSql("Select Recipe.* FROM Recipe " +
                    "INNER JOIN Recipe_Category ON Recipe.Id = Recipe_Category.RecipeId " +
                    "INNER JOIN CategoryItem ON Recipe_Category.CategoryItemId = CategoryItem.Id " +
                    "WHERE CategoryItem.CategoryItemName=N'" + categoryName + "'").ToList();

                foreach (var item in listItems)
                {
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";
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



        public async Task<int> CreateRecipeWithStepsAndResultAsync(RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory)
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
                    return recipeEntity.Id;
                }
                catch (Exception ex)
                {
                    // neu bi loi thi rollback va throw cho phia ngoai controller catch
                    transaction.Rollback();
                    throw ex;
                }
            }
        }

        public async Task UpdateIsShareReaction(int recipeId, int userId)
        {
            var recipeDbset = this.unitOfWork.GetDbContext().Set<UserReactionRecipe>();
            var recipe = recipeDbset.Where(q => q.RecipeId == recipeId && q.UserId == userId).FirstOrDefault();
            if (recipe == null)
            {
                var creatingUserReactionRecipeVM = new UserReactionRecipeViewModel()
                {
                    UserId = userId,
                    RecipeId = recipeId,
                    IsShare = true,
                    TotalShare = 1,
                };
                var userReactionRecipe = this.VMToEntity<UserReactionRecipe, UserReactionRecipeViewModel>(creatingUserReactionRecipeVM);
                await recipeDbset.AddAsync(userReactionRecipe);
                await this.unitOfWork.CommitAsync();
            }
            else
            {
                if (recipe.TotalShare == null)
                {
                    recipe.TotalShare = 0;
                }
                recipe.TotalShare += 1;
                recipe.IsShare = true;
                recipeDbset.Update(recipe);
                await this.unitOfWork.CommitAsync();
            }

        }

        public async Task<ICollection<RecipeViewModel>> GetTimeLineRecipes(UserManager<SRSNUser> userManager, int userId, int limit, int page)
        {
            var list = new List<RecipeViewModel>();
            var listItems = this.Get().AsNoTracking().Where(r => r.Active == true && r.UserId == userId).OrderByDescending(x => x.CreateTime).ToList();
            foreach (var item in listItems)
            {
                var recipeUserID = await userManager.FindByIdAsync(userId.ToString());
                item.AccountVM = new AccountViewModel();
                mapper.Map(recipeUserID, item.AccountVM);
                list.Add(item);
            }
            list = list.Skip(page * limit).Take(limit).ToList();
            return list;
        }

        public async Task<RecipeViewModel> getBestRecipeOfUser(int userId)
        {
            var recipeEntity = this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM Recipe WHERE Active='1' AND UserId=" + userId + "AND ReferencedRecipeId IS NULL ORDER BY EvRating DESC, ViewQuantity DESC").ToList().FirstOrDefault();
            var recipeVM = new RecipeViewModel();
            mapper.Map(recipeEntity, recipeVM);
            return recipeVM;
        }

        public async Task<ICollection<RecipeViewModel>> GetAllRecipeByUserIdOrderbyTime(int userId)
        {
            try
            {
                var stepOfRecipeRepo = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
                var ingredientRepo = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
                var categoryRepo = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
                var recipes = await this.Get(p => p.UserId == userId && p.Active == true).OrderByDescending(p => p.CreateTime).ToListAsync();
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

        public async Task UpdateRecipeSaveDraft(int recipeId, RecipeViewModel recipeVM, List<StepsOfRecipeViewModel> listSORVM, List<RecipeIngredientViewModel> listIngredient, List<RecipeCategoryViewModel> listCategory)
        {
            var stepRecipeDBSet = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
            var recipeIngredientDBSet = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
            var recipeCategoryDBSet = this.unitOfWork.GetDbContext().Set<RecipeCategory>();

            var listIngreId = listIngredient.Select(x => x.Id);
            var listSORId = listSORVM.Select(x => x.Id);
            var listCateId = listCategory.Select(x => x.Id);

            using (var transaction = await this.unitOfWork.GetDbTransactionAsync())
            {
                try
                {
                    var recipeEntity = this.VMToEntity(recipeVM);
                    // recipeEntity.Id = recipeId;
                    recipeEntity.Id = recipeId;
                    recipeEntity.UpdateTime = DateTime.Now;
                    this.selfDbSet.Update(recipeEntity);
                    await this.unitOfWork.CommitAsync();

                    // delete all wasted Step Of Recipes
                    var listOfWastedSOR = stepRecipeDBSet
                        .AsNoTracking()
                        .Where(x => x.RecipeId == recipeId
                                    && !listSORId.Contains(x.Id));
                    stepRecipeDBSet.RemoveRange(listOfWastedSOR);
                    await this.unitOfWork.CommitAsync();

                    // update step of recipe
                    foreach (var sorVM in listSORVM)
                    {
                        var sorEntity = this.VMToEntity<StepsOfRecipe, StepsOfRecipeViewModel>(sorVM);
                        sorEntity.RecipeId = recipeEntity.Id;
                        stepRecipeDBSet.Update(sorEntity);
                        await this.unitOfWork.CommitAsync();
                    }

                    // delete all wasted Ingredient
                    var listOfWastedIngredient = recipeIngredientDBSet
                        .AsNoTracking()
                        .Where(x => x.RecipeId == recipeId
                                    && !listIngreId.Contains(x.Id));
                    recipeIngredientDBSet.RemoveRange(listOfWastedIngredient);
                    await this.unitOfWork.CommitAsync();

                    // update ingredients
                    foreach (var ingredient in listIngredient)
                    {
                        var ingredientEntity = this.VMToEntity<RecipeIngredient, RecipeIngredientViewModel>(ingredient);
                        ingredientEntity.RecipeId = recipeEntity.Id;
                        recipeIngredientDBSet.Update(ingredientEntity);
                        await this.unitOfWork.CommitAsync();
                    }


                    // delete all wasted category 
                    var listOfWastedCategory = recipeCategoryDBSet
                        .AsNoTracking()
                        .Where(x => x.RecipeId == recipeId
                                    && !listCateId.Contains(x.Id));
                    recipeCategoryDBSet.RemoveRange(listOfWastedCategory);
                    await this.unitOfWork.CommitAsync();

                    // update category
                    var recipeCategoryList = this.recipeCategoryService.GetListRecipeCategory(recipeId).Result.ToList();
                    for (var i = 0; i < recipeCategoryList.Count; i++)
                    {
                        bool isFound = false;
                        for (var j = 0; j < listCategory.Count; j++)
                        {
                            if (recipeCategoryList[i].Id == listCategory[j].Id)
                            {
                                isFound = true;
                            }
                        }
                        if (!isFound)
                        {
                            Debug.WriteLine("Removed record | " + recipeCategoryList[i].RecipeId + " | " + recipeCategoryList[i].CategoryItemId);
                            RecipeCategory rc = new RecipeCategory();
                            recipeCategoryDBSet.Remove(
                                this.VMToEntity<RecipeCategory,
                                RecipeCategoryViewModel>(recipeCategoryList[i])
                            );
                            await this.unitOfWork.CommitAsync();
                        }
                    }
                    foreach (var recipeCategory in listCategory)
                    {
                        recipeCategory.RecipeId = recipeEntity.Id;
                        if (recipeCategory.Id == 0)
                        {
                            Debug.WriteLine("New record | " + recipeCategory.RecipeId + " | " + recipeCategory.CategoryItemId);
                            var rc = this.VMToEntity<RecipeCategory, RecipeCategoryViewModel>(recipeCategory);
                            await recipeCategoryDBSet.AddAsync(rc);
                            this.unitOfWork.Commit();
                        }
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

        public async Task<ICollection<RecipeViewModel>> GetAllDraftRecipeByUserIdOrderbyTime(int userId)
        {
            try
            {
                var stepOfRecipeRepo = this.unitOfWork.GetDbContext().Set<StepsOfRecipe>();
                var ingredientRepo = this.unitOfWork.GetDbContext().Set<RecipeIngredient>();
                var categoryRepo = this.unitOfWork.GetDbContext().Set<RecipeCategory>();
                var recipes = await this.Get(p => p.UserId == userId && p.Active == false && p.SaveDraft == true).OrderByDescending(p => p.CreateTime).ToListAsync();
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

        public async Task<ICollection<RecipeViewModel>> GetDraftRecipeWithID(UserManager<SRSNUser> userManager, int recipeId)
        {
            try
            {
                var list = new List<RecipeViewModel>();

                var listItems = this.selfDbSet.AsNoTracking().FromSql("select * from Recipe where Id=" + recipeId + "").ToList();
                foreach (var item in listItems)
                {
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                    var accountVM = new AccountViewModel();
                    mapper.Map(currentUser, accountVM);

                    // apply automapper 
                    var recipeViewModel = this.EntityToVM(item);

                    recipeViewModel.FullName = fullName;
                    recipeViewModel.AccountVM = accountVM;
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






