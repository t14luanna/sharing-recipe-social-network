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
        private DbSet<UserRecipePoint> dbSet;
        public UserRecipePointService(UnitOfWork uow)
        {
            this.uow = uow;
            this.dbSet = this.uow.GetDbContext().Set<UserRecipePoint>();
        }

        public async Task<List<UserRecipePoint>> GetListUserRecipePoints()
        {
            var set = this.dbSet.AsNoTracking();
            var numberOfRow = await set.CountAsync();
            if(numberOfRow > 0)
            {
                return await set.ToListAsync();
            }
            return null;
        }
    }
}
