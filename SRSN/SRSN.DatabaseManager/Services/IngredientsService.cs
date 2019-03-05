using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IIngredientsService : IBaseService<Ingredients, IngredientsViewModel>
    {
        ICollection<StoreViewModel> GetListStoreByIngredientName(string ingredientName);
    }

    public class IngredientsService : BaseService<Ingredients, IngredientsViewModel>, IIngredientsService
    {
        public IngredientsService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        /// <summary>
        /// Ham nay de lay ra tap hop store view model tu tap hop ingredient co ten giong voi ten truyen vao
        /// </summary>
        /// <param name="ingredientName"></param>
        /// <returns></returns>
        public ICollection<StoreViewModel> GetListStoreByIngredientName(string ingredientName)
        {
            var storeRepo = this.unitOfWork.GetDbContext().Set<Store>();
            // get list ingredient like name
            var listIngredientLikeName = selfDbSet
                .AsNoTracking()
                .Where(p => p.IngredientName.Contains(ingredientName, StringComparison.CurrentCultureIgnoreCase));

            // create new list Store ViewModel
            var listStoreVM = new List<StoreViewModel>();
            foreach (var ingredient in listIngredientLikeName)
            {
                // convert store => store VM
                var store = storeRepo.Find(ingredient.Id);
                if(store != null)
                {
                    var storeVM = this.EntityToVM<Store, StoreViewModel>(store);
                    if(!listStoreVM.Any(s => s.Id == storeVM.Id))
                        listStoreVM.Add(storeVM);
                }
            }
            return listStoreVM;
        }
        

        
        
    }
}
