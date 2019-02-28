using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace SRSN.UserBehavior
{
    public class UnitOfWork : IDisposable
    {
        private DbContext context;
        public UnitOfWork()
        {
            this.context = new Entities.CookyDemoContext();
        }

        public DbContext GetDbContext()
        {
            return this.context;
        }

        public void Commit()
        {
            this.context.SaveChanges();
        }
        public async Task CommitAsync()
        {
            await this.context.SaveChangesAsync();
        }

        public IDbContextTransaction BeginTransaction()
        {
            return this.context.Database.BeginTransaction();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await this.context.Database.BeginTransactionAsync();
        }

        public void CommitTransaction()
        {
            this.context.Database.CommitTransaction();
        }

        public void RollbackTransaction()
        {
            this.context.Database.RollbackTransaction();
        }

        /// <summary>
        /// Dispose when end of using
        /// </summary>
        public void Dispose()
        {
            this.context.Dispose();
        }
    }
}

