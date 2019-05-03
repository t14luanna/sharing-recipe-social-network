using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.UserBehavior.Entities.Services
{
    public class RecipeService
    {
        private UnitOfWork uow;
        private DbSet<Recipe> dbSet;
        public RecipeService(UnitOfWork uow)
        {
            this.uow = uow;
            this.dbSet = this.uow.GetDbContext().Set<Recipe>();
        }
        public async Task<List<Recipe>> GetListRecipes()
        {
            var set = this.dbSet.AsNoTracking().Where(r => r.Active == true);
            var numberOfRow = await set.CountAsync();
            if (numberOfRow > 0)
            {
                return await set.ToListAsync();
            }
            return null;
        }
        public void Update(Recipe data)
        {
            this.dbSet.Attach(data).State = EntityState.Modified;
            uow.Commit();
        }

    }
}
