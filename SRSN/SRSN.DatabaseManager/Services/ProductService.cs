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
        ICollection<StoreViewModel> GetListStoreByProductID(List<string> ingredientNames, double userLat, double userLong);
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
                                        .GroupBy(x => x.BrandId).Select(x => x.Key)
                                        .ToList();

            var listStoreVM = new List<StoreViewModel>();
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

        public ICollection<StoreViewModel> GetListStoreByProductID(List<string> ingredientNames, double userLat, double userLong)
        {
            //var brandIds = this.unitOfWork.GetDbContext().Set<StoreBrand>().ToList().Select(x=>x.Id);
            //var productBrandIdList = new List<int>();
            //foreach (var brandId in brandIds)
            //{
            //    var isGoodThing = true;
            //    foreach (var ingredientName in ingredientNames)
            //    {
            //        if(!(this.Get(x => x.BrandId == brandId && (string.IsNullOrEmpty(x.Name) ? "NULL" : x.Name).Contains(ingredientName, StringComparison.CurrentCultureIgnoreCase)).Count() > 0))
            //        {
            //            isGoodThing = false;
            //            break;
            //        }
            //    }
            //    if(isGoodThing)
            //    {
            //        productBrandIdList.Add(brandId);
            //    }
            //}

            //var listStoreVM = new List<StoreViewModel>();
            //foreach (var productBrandId in productBrandIdList)
            //{
            //    var storeRepo = this.unitOfWork.GetDbContext().Set<Store>();
            //    var store = storeRepo.AsNoTracking().Where(x => x.BrandId == productBrandId).ProjectTo<StoreViewModel>(this.mapper.ConfigurationProvider).ToList();
            //    foreach (var item in store)
            //    {
            //        if (item.Lat.HasValue && item.Long.HasValue)
            //        {
            //            var sCoord = new GeoCoordinate(item.Lat.Value, item.Long.Value);
            //            var eCoord = new GeoCoordinate(userLat, userLong);
            //            var distance = sCoord.GetDistanceTo(eCoord) / 1000;
            //            if (distance < 1)
            //            {
            //                listStoreVM.Add(item);
            //            }
            //        }
            //    }
            //}
            //return listStoreVM;
            var brandIds = this.unitOfWork.GetDbContext().Set<StoreBrand>().ToList().Select(x => x.Id);
            var storeIngreBrands = this.unitOfWork.GetDbContext().Set<StoreBrandIngredient>().ToList();
            var ingredientEntity = this.unitOfWork.GetDbContext().Set<Ingredients>().ToList();
            var productBrandIdList = new List<int>(); 
            foreach (var ingredientName in ingredientNames)
            {
                var existedIngreCount = ingredientEntity.Where(x => x.IngredientName.Contains(ingredientName)).Count();
                if (existedIngreCount > 0)
                {
                    var existedIngrIds = ingredientEntity.Where(x => x.IngredientName.Contains(ingredientName)).Select(x => x.Id).ToList();
                    foreach (var item in existedIngrIds)
                    {
                        var existedIngre = storeIngreBrands.Where(x => x.IngredientId == item).Count();
                        if(existedIngre > 0)
                        {
                            var brandId = storeIngreBrands.Where(x => x.IngredientId == item).FirstOrDefault().StoreBrandId;
                            productBrandIdList.Add(brandId);
                        }
                    }
                }
            }
            var listStoreVM = new List<StoreViewModel>();
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
