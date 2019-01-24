using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.Services;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using System;

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
            services.AddScoped(typeof(DbContext), typeof(CookyDemoContext));
            // cau hinh Services
            services.AddScoped(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddScoped(typeof(IRecipeService), typeof(RecipeService));
            // cau hinh AutoMapper
            var mapperConfig = new MapperConfiguration(mc => {
                mc.CreateMissingTypeMaps = true;
                mc.CreateMap<RecipeViewModel, Recipe>();
                mc.CreateMap<Recipe, RecipeViewModel>();
            });
            var mapper = mapperConfig.CreateMapper();
            services.AddSingleton<IMapper>(mapper);
        }
    }
}
