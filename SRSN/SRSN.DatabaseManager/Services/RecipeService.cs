using AutoMapper;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.Services
{
    public interface IRecipeService : IBaseService<Recipe, RecipeViewModel>
    {

    }

    public class RecipeService : BaseService<Recipe, RecipeViewModel>, IRecipeService
    {
        public RecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
