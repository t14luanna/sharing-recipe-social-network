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
    public interface ILikePostService : IBaseService<LikePost, LikePostViewModel>
    {

    }
    public class LikePostService : BaseService<LikePost, LikePostViewModel>, ILikePostService
    {
        public LikePostService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
