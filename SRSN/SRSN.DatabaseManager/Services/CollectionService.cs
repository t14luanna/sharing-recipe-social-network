using AutoMapper;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface ICollectionService : IBaseService<Collection, CollectionViewModel>
    {
        Task<CollectionViewModel> DeactiveAsync(int id);
    }
    public class CollectionService : BaseService<Collection,CollectionViewModel>, ICollectionService 
    {
        public CollectionService(IUnitOfWork unitOfWork, IMapper mapper):base (unitOfWork, mapper)
        {
        }
        public async Task<CollectionViewModel> DeactiveAsync(int id)
        {
            var trueEntity = await selfDbSet.FindAsync(id);
            trueEntity.Active = false;
            selfDbSet.Update(trueEntity);
            await unitOfWork.CommitAsync();
            var newVM = EntityToVM(trueEntity);
            return newVM;

        }

    }
}
