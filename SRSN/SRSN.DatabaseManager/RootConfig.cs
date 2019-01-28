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
            services.AddIdentity<SRSNUser, IdentityRole>()
                .AddEntityFrameworkStores<SRSNIdentityDbContext>()
                .AddDefaultTokenProviders();


            var key = Encoding.Default.GetBytes("@everyone:SRSNSecret!");
            var issuer = "http://srsn.com";
            var audience = "http://srsn.com";
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

            services.AddScoped(typeof(IdentityDbContext<SRSNUser>), typeof(SRSNUserManager));
            services.AddScoped(typeof(DbContext), typeof(CookyDemoContext));
            // cau hinh Services
            services.AddScoped(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddScoped(typeof(IRecipeService), typeof(RecipeService));
            services.AddScoped(typeof(ICollectionService), typeof(CollectionService));
            // cau hinh AutoMapper
            var mapperConfig = new MapperConfiguration(mc => {
                mc.CreateMissingTypeMaps = true;

                // chung ta se cau hinh ignore tai day
                mc.CreateMap<RecipeViewModel, Recipe>();
                mc.CreateMap<Recipe, RecipeViewModel>();

                mc.CreateMap<StepsOfRecipeViewModel, StepsOfRecipe>()
                    .ForMember(x => x.Recipe, y => y.Ignore());


                mc.CreateMap<CollectionViewModel, Collection>();
                mc.CreateMap<Collection, CollectionViewModel>();
            });
            var mapper = mapperConfig.CreateMapper();
            services.AddSingleton<IMapper>(mapper);
        }
    }
}
