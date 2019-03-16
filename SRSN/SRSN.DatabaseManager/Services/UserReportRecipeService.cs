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
    public interface IUserReportRecipeService : IBaseService<UserReportRecipe, UserReportRecipeViewModel>
    {

    }

    public class UserReportRecipeService : BaseService<UserReportRecipe, UserReportRecipeViewModel>, IUserReportRecipeService
    {

        public UserReportRecipeService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {

        }
    }
}
