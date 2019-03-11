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
    public interface ICollectionPostService : IBaseService<CollectionPost, CollectionPostViewModel>
    {

    }
    public class CollectionPostService : BaseService<CollectionPost, CollectionPostViewModel>, ICollectionPostService
    {
        public CollectionPostService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
