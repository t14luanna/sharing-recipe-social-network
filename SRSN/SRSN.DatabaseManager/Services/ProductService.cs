using AutoMapper;
using AutoMapper.QueryableExtensions;
using GeoCoordinatePortable;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRSN.DatabaseManager.Services
{
    public interface IProductService : IBaseService<Products, ProductViewModel>
    {
        ICollection<StoreViewModel> GetListStoreByProductID(int productId, double userLat, double userLong);
    }
    public class ProductService : BaseService<Products, ProductViewModel>, IProductService
    {
        public ProductService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public ICollection<StoreViewModel> GetListStoreByProductID(int productId, double userLat, double userLong)
        {
            var product = this.selfDbSet.Find(productId);
            var storeRepo = this.unitOfWork.GetDbContext().Set<Store>();
            // create new list Store ViewModel
            var listStoreVM = new List<StoreViewModel>();
            var store = storeRepo.AsNoTracking().Where(x => x.BrandId == product.BrandId).ProjectTo<StoreViewModel>(this.mapper.ConfigurationProvider).ToList();
            foreach (var item in store)
            {
                if(item.Lat.HasValue && item.Long.HasValue)
                {
                    var sCoord = new GeoCoordinate(item.Lat.Value, item.Long.Value);
                    var eCoord = new GeoCoordinate(userLat, userLong);
                    var distance = sCoord.GetDistanceTo(eCoord) / 1000;
                    if(distance < 3)
                    {
                        listStoreVM.Add(item);
                    }
                }
            }
            return listStoreVM;
        }
    }
}
