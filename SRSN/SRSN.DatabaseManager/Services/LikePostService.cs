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
    public interface IUserReactionPostService : IBaseService<UserReactionPost, UserReactionViewModel>
    {

    }
    public class UserReactionService : BaseService<UserReactionPost, UserReactionViewModel>, IUserReactionPostService
    {
        public UserReactionService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
