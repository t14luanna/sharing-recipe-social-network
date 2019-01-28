using AutoMapper;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IRatingRecipeService : IBaseService<RatingRecipe, RatingRecipeViewModel>
    {

    }

    public class RatingRecipeService : BaseService<RatingRecipe, RatingRecipeViewModel>, IRatingRecipeService
    {
        public RatingRecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
