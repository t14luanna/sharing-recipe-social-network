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
    public interface ICollectionService : IBaseService<Collection, CollectionViewModel>
    {

    }
    public class CollectionService : BaseService<Collection,CollectionViewModel>, ICollectionService
    {
        public CollectionService(IUnitOfWork unitOfWork, IMapper mapper):base (unitOfWork, mapper)
        {
        }
    }
}
