using GeoCoordinatePortable;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.UpdateLatLongStore.Entities.Services
{
    public class StoreService
    {
        private UnitOfWork uow;
        private DbSet<Store> dbSet;
        public StoreService(UnitOfWork uow)
        {
            this.uow = uow;
            this.dbSet = this.uow.GetDbContext().Set<Store>();
        }

        public async Task<List<Store>> GetListAddress()
        {
            var set = this.dbSet.AsNoTracking();
            var numberOfRow = await set.CountAsync();
            if (numberOfRow > 0)
            {
                return await set.ToListAsync();
            }
            return null;
        }
        public void UpdateLatLong(Store store)
        {
            dbSet.Attach(store).State = EntityState.Modified;
            uow.Commit();
        }
    }
}
