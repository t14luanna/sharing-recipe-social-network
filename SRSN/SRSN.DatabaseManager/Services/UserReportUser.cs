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
    public interface IUserReportUserService : IBaseService<UserReportUser, UserReportUserViewModel>
    {

    }
    public class UserReportUserService : BaseService<UserReportUser, UserReportUserViewModel>, IUserReportUserService
    {
        public UserReportUserService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {

        }
    }
}
