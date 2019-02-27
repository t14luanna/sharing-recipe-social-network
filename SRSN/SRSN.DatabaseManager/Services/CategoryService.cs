using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Entities;
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
    public interface ICategoryService:IBaseService<CategoryMain, CategoryViewModel>
    {
        ICollection<CategoryMain> GetCategoryMain();
    }
    public class CategoryService : BaseService<CategoryMain, CategoryViewModel>, ICategoryService
    {
        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public ICollection<CategoryMain> GetCategoryMain()
        {
            var categoryMain = this.unitOfWork.GetDbContext().Set<CategoryMain>().AsNoTracking().ToList();
            var categories = new List<CategoryViewModel>();
            foreach (CategoryMain main in categoryMain)
            {
                var items = this.unitOfWork.GetDbContext().Set<CategoryItem>().AsNoTracking().Where(c => c.CategoryMainId == main.Id).ToList();
                main.CategoryItem = items;
            }
            return categoryMain;
        }
    }
}
