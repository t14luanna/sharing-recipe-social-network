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
    public interface ICategoryService:IBaseService<CategoryMain, CategoryViewModel>
    {

    }
    public class CategoryService : BaseService<CategoryMain, CategoryViewModel>, ICategoryService
    {
        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}
