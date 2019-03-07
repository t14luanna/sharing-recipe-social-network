using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SRSN.UserBehavior;

namespace SRSN.UserBehavior.Entities.Services
{
    public class UserRecipePointService
    {
        private UnitOfWork uow;
        private DbSet<UserReactionRecipe> dbSet;
        public UserRecipePointService(UnitOfWork uow)
        {
            this.uow = uow;
            this.dbSet = this.uow.GetDbContext().Set<UserReactionRecipe>();
        }

        public async Task<List<UserReactionRecipe>> GetListUserRecipePoints()
        {
            var set = this.dbSet.AsNoTracking();
            var numberOfRow = await set.CountAsync();
            if(numberOfRow > 0)
            {
                return await set.ToListAsync();
            }
            return null;
        }
        public void Update(UserReactionRecipe data)
        {
            this.dbSet.Attach(data).State = EntityState.Modified;
            uow.Commit();
        }
    }
}
