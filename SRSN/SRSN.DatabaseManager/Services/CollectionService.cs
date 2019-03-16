using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface ICollectionService : IBaseService<Collection, CollectionViewModel>
    {
        Task<CollectionViewModel> DeactiveAsync(int id); 
        Task<ICollection<CollectionViewModel>> GetTopCollection(UserManager<SRSNUser> userManager);
        Task<CollectionViewModel> GetCollectionById(UserManager<SRSNUser> userManager, int collectionId);
    }
    public class CollectionService : BaseService<Collection, CollectionViewModel>, ICollectionService
    {
        public CollectionService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
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

        public async Task<CollectionViewModel> GetCollectionById(UserManager<SRSNUser> userManager, int collectionId)
        {
            try
            {
                var collection = this.selfDbSet.AsNoTracking().Where(p => p.Active == true && p.Id == collectionId).FirstOrDefault();
                // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                var currentUser = userManager.FindByIdAsync(collection.UserId.ToString()).Result;
                var fullName = $"{currentUser.UserName}";
                var collectionViewModel = this.EntityToVM(collection);
                collectionViewModel.FullName = fullName;

                return collectionViewModel;
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<ICollection<CollectionViewModel>> GetTopCollection(UserManager<SRSNUser> userManager)
        {
            try
            {
                var list = new List<CollectionViewModel>();
                var listItems = this.selfDbSet.AsNoTracking().Where(p => p.Active == true).Take(6);
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.UserName}";
                    var collectionViewModel = this.EntityToVM(item);
                    collectionViewModel.FullName = fullName;
                    list.Add(collectionViewModel);

                }
                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
