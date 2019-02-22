using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using System;
using System.Text;

namespace SRSN.DatabaseManager
{
    public static class RootConfig
    {
        public static void Entry(IServiceCollection services, IConfiguration configuration)
        {
            // cau hinh db context
            services.AddDbContext<CookyDemoContext>(builder => {
                builder.UseSqlServer(configuration.GetConnectionString("DbConnectionString"));
            });
            services.AddDbContext<SRSNIdentityDbContext>(builder =>
            {
                builder.UseSqlServer(configuration.GetConnectionString("IdentityDbConnectionString"));
            });
            services.AddIdentity<SRSNUser, IdentityRole<int>>()
                .AddEntityFrameworkStores<SRSNIdentityDbContext>()
                .AddDefaultTokenProviders();


            var key = Encoding.Default.GetBytes("@everyone:SRSNSecret!");
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddScoped(typeof(IdentityDbContext<SRSNUser, IdentityRole<int>,int>), typeof(SRSNIdentityDbContext));
            services.AddScoped(typeof(SRSNUserManager));
            services.AddScoped(typeof(DbContext), typeof(CookyDemoContext));
            
            // cau hinh Services
            services.AddScoped(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddScoped(typeof(IRecipeService), typeof(RecipeService));
            services.AddScoped(typeof(ICollectionService), typeof(CollectionService));
            services.AddScoped(typeof(IStepsOfRecipeService), typeof(StepsOfRecipeService));
            services.AddScoped(typeof(IUserBlockService), typeof(UserBlockService));
            services.AddScoped(typeof(ILikePostService), typeof(LikePostService));
            services.AddScoped(typeof(ICommentService), typeof(CommentService));
            services.AddScoped(typeof(IRatingRecipeService), typeof(RatingRecipeService));
            services.AddScoped(typeof(INotificationService), typeof(NotificationService));
            services.AddScoped(typeof(ICategoryService), typeof(CategoryService));
            services.AddScoped(typeof(IIngredientsService), typeof(IngredientsService));
            services.AddScoped(typeof(IPostService), typeof(PostService));

            // cau hinh AutoMapper
            var mapperConfig = new MapperConfiguration(mc => {
                mc.CreateMissingTypeMaps = true;

                // chung ta se cau hinh ignore tai day
                mc.CreateMap<RecipeViewModel, Recipe>();
                mc.CreateMap<Recipe, RecipeViewModel>();

                mc.CreateMap<CategoryItemViewModel, StepsOfRecipe>()
                    .ForMember(x => x.Recipe, y => y.Ignore());


                mc.CreateMap<CollectionViewModel, Collection>();
                mc.CreateMap<Collection, CollectionViewModel>();

                mc.CreateMap<AccountEditViewModel, SRSNUser>()
                    .ForMember(x => x.AccessFailedCount, y=> y.Ignore())
                    .ForMember(x => x.ConcurrencyStamp, y=> y.Ignore())
                    .ForMember(x => x.EmailConfirmed, y => y.Ignore())
                    .ForMember(x => x.LockoutEnabled, y => y.Ignore())
                    .ForMember(x => x.LockoutEnd, y => y.Ignore())
                    .ForMember(x => x.NormalizedEmail, y => y.Ignore())
                    .ForMember(x => x.NormalizedUserName, y => y.Ignore())
                    .ForMember(x => x.PasswordHash, y => y.Ignore())
                    .ForMember(x => x.PhoneNumber, y => y.Ignore())
                    .ForMember(x => x.PhoneNumberConfirmed, y => y.Ignore())
                    .ForMember(x => x.SecurityStamp, y => y.Ignore())
                    .ForMember(x => x.TwoFactorEnabled, y => y.Ignore());
                mc.CreateMap<SRSNUser, AccountEditViewModel>()
                    .ForMember(x => x.UsernameVM, y => y.Ignore())
                    .ForMember(x => x.Password, y => y.Ignore())
                    .ForMember(x => x.ConfirmPassword, y => y.Ignore());


                mc.CreateMap<UserBlockViewModel, UserBlock>()
                   .ForMember(x => x.BlockedUser, y => y.Ignore())
                   .ForMember(x => x.User, y => y.Ignore());
                mc.CreateMap<LikePostViewModel, LikePost>()
                  .ForMember(x => x.User, y => y.Ignore())
                  .ForMember(x => x.Post, y => y.Ignore());
                mc.CreateMap<RecipeIngredientViewModel, RecipeIngredient>()
                 .ForMember(x => x.Recipe, y => y.Ignore())
                 .ForMember(x => x.IngredientId, y => y.Ignore());
                mc.CreateMap<RecipeCategoryViewModel, RecipeCategory>()
                .ForMember(x => x.Recipe, y => y.Ignore())
                .ForMember(x => x.CategoryItem, y => y.Ignore());
                mc.CreateMap<RatingRecipeViewModel, Recipe>();
                mc.CreateMap<Recipe, RatingRecipeViewModel>();

                mc.CreateMap<CommentViewModel, Comment>();
                mc.CreateMap<Comment, CommentViewModel>();

                mc.CreateMap<RatingRecipeViewModel, RatingRecipe>();
                mc.CreateMap<RatingRecipe, RatingRecipeViewModel>();


                mc.CreateMap<NotificationViewModel, Notification>();
                mc.CreateMap<Notification, NotificationViewModel>();

                mc.CreateMap<CategoryViewModel, CategoryMain>();
                mc.CreateMap<CategoryMain , CategoryViewModel>();

                mc.CreateMap<PostViewModel, Post>();
                mc.CreateMap<Post, PostViewModel>();

                mc.CreateMap<CategoryItemViewModel, StepsOfRecipe>();
                mc.CreateMap<StepsOfRecipe, CategoryItemViewModel>();


            });
            var mapper = mapperConfig.CreateMapper();
            services.AddSingleton<IMapper>(mapper);
        }
    }
}
