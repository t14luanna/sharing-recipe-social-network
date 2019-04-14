using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using SRSN.DatabaseManager;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Redis;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;
using StackExchange.Redis;

namespace SRSN.ClientApi.Controllers
{
    #region Controllers
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private string userRecipeRecommendPrefix = "RCS_User_";
        private string rankrecipePrefix = "Rank_Recipe_";

        private IRecipeService recipeService;
        private IUserFollowingService userFollowingService;
        private UserManager<SRSNUser> userManager;
        private SRSNUserManager SRSNuserManager;
        private IDatabase redisDatabase;
        private IMapper mapper;
        public RecipeController(IRecipeService recipeService, IUserFollowingService userFollowingService, UserManager<SRSNUser> userManager, IMapper mapper, SRSNUserManager SRSNuserManager)
        {
            this.recipeService = recipeService;
            this.userFollowingService = userFollowingService;
            this.SRSNuserManager = SRSNuserManager ?? throw new ArgumentNullException(nameof(SRSNuserManager));
            this.userManager = userManager;
            this.redisDatabase = RedisUtil.Connection.GetDatabase();
            this.mapper = mapper;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody]RequestCreateRecipeWithConstraintViewMode request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.RecipeVM.UserId = int.Parse(userId);

            await recipeService.CreateRecipeWithStepsAsync(request.RecipeVM, request.ListSORVM, request.ListIngredient, request.ListCategory);
            return Ok(new
            {
                message = $"Ban da tao thanh cong Công thức co ten la: {request.RecipeVM.RecipeName}"
            });
        }
        [HttpDelete("delete")]
        [Authorize]
        public async Task<ActionResult> Delete(int recipeId)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            await recipeService.DeActiveRecipe(recipeId);
            return Ok(new
            {
                message = $"Ban da xoa thanh cong Recipe co ten la: {recipeId}"
            });
        }

        [HttpGet("read")]
        public async Task<ActionResult> Read(int userId)
        {
            try
            {
                return Ok(await recipeService.GetAllRecipeByUserId(userId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-orderby-time")]
        public async Task<ActionResult> ReadOrderByTime(int userId)
        {
            try
            {
                return Ok(await recipeService.GetAllRecipeByUserIdOrderbyTime(userId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-draft-recipe")]
        public async Task<ActionResult> ReadDraftRecipe(int userId)
        {
            try
            {
                return Ok(await recipeService.GetAllDraftRecipeByUserIdOrderbyTime(userId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-recipe")]
        public async Task<ActionResult> ReadRecipe(int recipeId)
        {
            try
            {
                return Ok(await recipeService.GetRecipeById(recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("read-popular")]
        public async Task<ActionResult> ReadPopular()
        {
            try
            {
                return Ok(await recipeService.GetPopularRecipes(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("read-latest")]
        public async Task<ActionResult> ReadLatest()
        {
            try
            {
                return Ok(await recipeService.GetLatestRecipes(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-related-recipe")]
        public async Task<ActionResult> ReadRelatedRecipe([FromQuery]int userId)
        {
            try
            {
                return Ok(await recipeService.GetRelatedRecipe(userId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("get-similar-recipes")]
        public async Task<ActionResult> ReadRecommendRecipes()
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userIdStr = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                var userId = 0;
                int.TryParse(userIdStr, out userId);

                var key = $"{userRecipeRecommendPrefix}{userIdStr}";

                // take limit from redis
                var datas = await redisDatabase.SortedSetRangeByScoreWithScoresAsync(key);
                var dataIds = datas.Select(x =>
                {
                    int recipeId = 0;
                    int.TryParse(x.Element, out recipeId);
                    return recipeId;
                });
                var rand = new Random();

                var SelectedPost = dataIds.Skip(rand.Next(0, dataIds.Count())).Take(6);
                var listRecipe = new List<RecipeViewModel>();
                foreach (var recipeId in SelectedPost)
                {
                    var recipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId && x.Active == true && x.ReferencedRecipeId == null);
                    if (recipe != null)
                    {
                        var recipeUserID = await userManager.FindByIdAsync(recipe.UserId.ToString());
                        recipe.AccountVM = new AccountViewModel();
                        mapper.Map(recipeUserID, recipe.AccountVM);
                        listRecipe.Add(recipe);
                    }
                    
                }
                return Ok(listRecipe);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("newsfeed-follow")]
        public async Task<ActionResult> ReadNewsfeedRecipes([FromQuery]int limit = 10, [FromQuery]int page = 0)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userIdStr = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                var userId = 0;
                int.TryParse(userIdStr, out userId);

                var key = $"{rankrecipePrefix}";
                var datas = await redisDatabase.SortedSetRangeByScoreWithScoresAsync(key, order: Order.Descending);
                var dataIds = datas.Select(x =>
                {
                    int id = 0;
                    int.TryParse(x.Element, out id);
                    return id;
                });
                // Get all user following ids
                var listUserFollowingId = await userFollowingService.GetAllFollowingUser(userId);

                //dataIds = dataIds.Skip(page * limit).Take(limit).ToList();
                dataIds = dataIds.ToList();
                var listRecipe = new List<RecipeViewModel>();
                foreach (var recipeId in dataIds)
                {
                    var recipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId && x.Active == true);
                    if (recipe != null)
                    {
                        if (listUserFollowingId.Contains(recipe.UserId.Value))
                        {
                            var recipeUserID = await userManager.FindByIdAsync(recipe.UserId.ToString());
                            recipe.AccountVM = new AccountViewModel();
                            mapper.Map(recipeUserID, recipe.AccountVM);
                            listRecipe.Add(recipe);
                        }
                    }
                }
                listRecipe = listRecipe.Skip(page * limit).Take(limit).ToList();
                return Ok(listRecipe);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("newsfeed-no-follow")]
        public async Task<ActionResult> ReadNewsfeedNoFollowingRecipes([FromQuery]int limit = 10, [FromQuery]int page = 0)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userIdStr = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                var userId = 0;
                int.TryParse(userIdStr, out userId);

                var key = $"{rankrecipePrefix}";
                var datas = await redisDatabase.SortedSetRangeByScoreWithScoresAsync(key, order: Order.Descending);
                var dataIds = datas.Select(x =>
                {
                    int id = 0;
                    int.TryParse(x.Element, out id);
                    return id;
                }).Take(20);
                // Get all user following ids
                var listUserFollowingId = await userFollowingService.GetAllFollowingUser(userId);


                //dataIds = dataIds.Skip(page * limit).Take(limit).ToList();
                var listRecipe = new List<RecipeViewModel>();
                foreach (var recipeId in dataIds)
                {
                    var recipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId && x.Active == true);
                    if (recipe != null)
                    {
                        if (!listUserFollowingId.Contains(recipe.UserId.Value))
                        {
                            var recipeUserID = await userManager.FindByIdAsync(recipe.UserId.ToString());
                            recipe.AccountVM = new AccountViewModel();
                            mapper.Map(recipeUserID, recipe.AccountVM);
                            listRecipe.Add(recipe);
                        }
                    }
                }
                listRecipe = listRecipe.Skip(page * limit).Take(limit).ToList();
                return Ok(listRecipe);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("get-time-line")]
        public async Task<ActionResult> ReadTimeLineRecipes([FromQuery]string userName, [FromQuery]int limit = 10, [FromQuery]int page = 0)
        {
            try
            {
                //ClaimsPrincipal claims = this.User;
                //var userIdStr = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                //var userId = 0;
                //int.TryParse(userIdStr, out userId);
                var user = await userManager.FindByNameAsync(userName);
                int userId = user.Id;
                return Ok(await recipeService.GetTimeLineRecipes(this.userManager, userId, limit, page));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-latest-page")]
        public async Task<ActionResult> ReadAllLatest(int limit = 10, int page = 0)
        {
            try
            {
                return Ok(await recipeService.GetAllLatestRecipes(this.userManager, limit, page));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-random")]
        public async Task<ActionResult> ReadRandom()
        {
            try
            {
                return Ok(await recipeService.GetRandomRecipes(this.userManager));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-recipeid")]
        public async Task<ActionResult> ReadRecipeWithId(int recipeId)
        {
            try
            {
                return Ok(await recipeService.GetRecipeWithID(this.userManager, recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-edit-recipeid")]
        public async Task<ActionResult> ReadRecipeWithIdToEdit(int recipeId)
        {
            try
            {
                return Ok(await recipeService.GetDraftRecipeWithID(this.userManager, recipeId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-lastest")]
        public async Task<ActionResult> ReadLastest()
        {
            try
            {
                return Ok(recipeService.GetLastestRecipes());
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpPut("update")]
        [Authorize]
        public async Task<ActionResult> Update([FromBody]RequestCreateRecipeWithConstraintViewMode request, [FromQuery]int recipeId)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await this.userManager.FindByIdAsync(userId);
            request.RecipeVM.UserId = int.Parse(userId);
            await recipeService.UpdateRecipe(recipeId, request.RecipeVM, request.ListSORVM, request.ListIngredient, request.ListCategory);
            return Ok(new
            {
                message = $"Ban da update thanh cong Recipe co ten la: {request.RecipeVM.RecipeName}"
            });
        }

        [HttpPut("Publish")]
        [Authorize]
        public async Task<ActionResult> Publish([FromBody]RequestCreateRecipeWithConstraintViewMode request, [FromQuery]int recipeId)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await this.userManager.FindByIdAsync(userId);
            request.RecipeVM.UserId = int.Parse(userId);

            // check recipe does exist
            var currentRecipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId);
            if (currentRecipe != null)
            {
                // update drafted recipe
                // beautify data 
                if (request.RecipeVM.SaveDraft == null || request.RecipeVM.SaveDraft == true) request.RecipeVM.SaveDraft = false;
                // update
                request.RecipeVM.Active = true;
                await recipeService.UpdateRecipe(recipeId, request.RecipeVM, request.ListSORVM, request.ListIngredient, request.ListCategory);
                var increasePointResult = SRSNuserManager.IncreasePoint(user, (int)IncreasePointRuleEnum.CreateNewRecipe);

                return Ok(new
                {
                    success = true,
                    message = $"Ban da publish thanh cong Recipe co ten la: {request.RecipeVM.RecipeName}"
                });
            }
            else
            {
                return Ok(new
                {
                    success = false,
                    message = $"Khong the tim thay recipe phu hop de publish"
                });
            }
        }


        [HttpPut("save-draft")]
        [Authorize]
        public async Task<ActionResult> SaveDraft([FromBody]RequestCreateRecipeWithConstraintViewMode request, [FromQuery]int recipeId)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await this.userManager.FindByIdAsync(userId);
            request.RecipeVM.UserId = int.Parse(userId);

            // check recipe does exist
            var currentRecipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId);
            if (currentRecipe != null)
            {
                if (currentRecipe.SaveDraft == null || currentRecipe.SaveDraft == false)
                {
                    return Ok(new
                    {
                        success = false,
                        message = $"Ban da khong the save draft, recipe da publish"
                    });
                }

                // update drafted recipe
                // beautify data 
                if (request.RecipeVM.SaveDraft == null || request.RecipeVM.SaveDraft == false) request.RecipeVM.SaveDraft = true;
                request.RecipeVM.CreateTime = currentRecipe.CreateTime;
                request.RecipeVM.Active = false;


                // update
                await recipeService.UpdateRecipeSaveDraft(recipeId, request.RecipeVM, request.ListSORVM, request.ListIngredient, request.ListCategory);
                var recipe = await recipeService.GetRecipeById(recipeId);
                return Ok(new
                {
                    recipe,
                    success = true,
                    message = $"Ban da update thanh cong Recipe co ten la: {request.RecipeVM.RecipeName}"
                });
            }
            else
            {
                // draft new recipe
                if (request.RecipeVM.SaveDraft == null || request.RecipeVM.SaveDraft == false) request.RecipeVM.SaveDraft = true;
                var createdRecipeId = await recipeService.CreateRecipeWithStepsAndResultAsync(request.RecipeVM, request.ListSORVM, request.ListIngredient, request.ListCategory);
                var recipe = await recipeService.GetRecipeById(createdRecipeId);
                return Ok(new
                {
                    recipe,
                    success = true,
                    message = $"Ban da draft thanh cong Recipe co ten la: {request.RecipeVM.RecipeName}"
                });
            }
        }

        /// <summary>
        /// Api useless and duplicate with Create
        /// Should merge
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("submit-recipe")]
        public async Task<ActionResult> SubmitRecipe([FromBody]RequestCreateRecipeWithConstraintViewMode request, [FromQuery]int recipeId)
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                var user = await this.userManager.FindByIdAsync(userId);
                request.RecipeVM.UserId = int.Parse(userId);
                var currentRecipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId);
                if (recipeId == 0)
                {
                    recipeId = await recipeService.CreateRecipeWithStepsAndResultAsync(request.RecipeVM, request.ListSORVM, request.ListIngredient, request.ListCategory);
                }
                else
                {
                    request.RecipeVM.Active = true;
                    request.RecipeVM.CreateTime = currentRecipe.CreateTime;
                    request.RecipeVM.SaveDraft = false;
                    await recipeService.UpdateRecipeSaveDraft(recipeId, request.RecipeVM, request.ListSORVM, request.ListIngredient, request.ListCategory);
                }
                var increasePointResult = SRSNuserManager.IncreasePoint(user, (int)IncreasePointRuleEnum.CreateNewRecipe);
                return Ok(new
                {
                    recipeId = recipeId,
                    message = $"Ban da tao thanh cong Recipe",
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    message = $"Ban tao recipe that bai",
                    error = ex.ToString()
                });
            }
        }
        [HttpGet("read-recipename")]
        public async Task<ActionResult> ReadRecipeName([FromQuery]string recipeName)
        {
            try
            {
                return Ok(await recipeService.GetRecipeNameLike(recipeName));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-recipename-page")]
        public async Task<ActionResult> ReadRecipeNamePage([FromQuery]string recipeName)
        {
            try
            {
                return Ok(await recipeService.GetRecipeName(recipeName));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("read-recipe-by-category")]
        public async Task<ActionResult> ReadRecipeByCategory([FromQuery] string categoryName)
        {
            try
            {
                return Ok(await recipeService.GetRecipeBaseOnCategory(userManager, categoryName));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("read-recipe-chef")]
        public async Task<ActionResult> ReadChefByRecipeId(int recipeId)
        {
            try
            {
                var recipe = await recipeService.FirstOrDefaultAsync(x => x.Id == recipeId);
                var recipeUserID = await userManager.FindByIdAsync(recipe.UserId.ToString());
                recipe.AccountVM = new AccountViewModel();
                mapper.Map(recipeUserID, recipe.AccountVM);
                return Ok(recipe);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet("get-best-recipe-of-user")]
        public async Task<ActionResult> GetBestRecipe(int userId)
        {
            try
            {
                return Ok(recipeService.getBestRecipeOfUser(userId));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpPost("create-share-recipe")]
        [Authorize]
        public async Task<ActionResult> CreateShareRecipe([FromBody]RecipeViewModel request)
        {
            ClaimsPrincipal claims = this.User;
            var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            request.UserId = int.Parse(userId);
            request.CreateTime = DateTime.Now;
            await recipeService.UpdateIsShareReaction(request.ReferencedRecipeId.Value, request.UserId.Value);
            await recipeService.CreateAsync(request);
            var user = await this.userManager.FindByIdAsync(userId);
            var increasePointResult = SRSNuserManager.IncreasePoint(user, (int)IncreasePointRuleEnum.SharingRecipe);
            return Ok(new
            {
                message = $"Ban da tao thanh cong Recipe co ten la: {request.Id}"
            });
        }
        #endregion
    }
}