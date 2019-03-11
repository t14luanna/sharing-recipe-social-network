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
        ICollection<StoreViewModel> GetListStoreByProductID(string ingredientName, double userLat, double userLong);
    }
    public class ProductService : BaseService<Products, ProductViewModel>, IProductService
    {
        public ProductService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        /// <summary>
        /// Lay ra danh sach store theo ingredient name va distance trung binh
        /// </summary>
        /// <param name="ingredientName"></param>
        /// <param name="userLat"></param>
        /// <param name="userLong"></param>
        /// <returns></returns>
        public ICollection<StoreViewModel> GetListStoreByProductID(string ingredientName, double userLat, double userLong)
        {
            var productBrandIdList = this.selfDbSet.Where(p => p.Name.Contains(ingredientName))
                                        .GroupBy(x=>x.BrandId).Select(x => x.Key)
                                        .ToList();

            var listStoreVM = new   List<StoreViewModel>();
            foreach (var productBrandId in productBrandIdList)
            {
                var storeRepo = this.unitOfWork.GetDbContext().Set<Store>();
                var store = storeRepo.AsNoTracking().Where(x => x.BrandId == productBrandId).ProjectTo<StoreViewModel>(this.mapper.ConfigurationProvider).ToList();
                foreach (var item in store)
                {
                    if (item.Lat.HasValue && item.Long.HasValue)
                    {
                        var sCoord = new GeoCoordinate(item.Lat.Value, item.Long.Value);
                        var eCoord = new GeoCoordinate(userLat, userLong);
                        var distance = sCoord.GetDistanceTo(eCoord) / 1000;
                        if (distance < 1)
                        {
                            listStoreVM.Add(item);
                        }
                    }
                }
            }
            return listStoreVM;
        }
    }
}
