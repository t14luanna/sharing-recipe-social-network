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
    public interface IProductService : IBaseService<Products, ProductViewModel>
    {
    }
    public class ProductService : BaseService<Products, ProductViewModel>, IProductService
    {
        public ProductService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
