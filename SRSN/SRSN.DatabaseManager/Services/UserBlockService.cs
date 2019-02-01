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
    public interface IUserBlockService : IBaseService<UserBlock, UserBlockViewModel>
    {

    }
    public class UserBlockService : BaseService<UserBlock, UserBlockViewModel>, IUserBlockService
    {
        public UserBlockService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
