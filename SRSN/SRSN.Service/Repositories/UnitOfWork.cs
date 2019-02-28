using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace SRSN.Service.Repositories
{

    public interface IUnitOfWork
    {
        DbContext GetDbContext();
        Task CommitAsync();
        void Commit();
        void Dispose();
        Task<IDbContextTransaction> GetDbTransactionAsync();
        IDbContextTransaction GetDbTransaction();
    }

    public class UnitOfWork : IUnitOfWork
    {
        private DbContext dbContext;
        private bool isDisposed;
        public UnitOfWork(DbContext dbContext)
        {
            this.dbContext = dbContext;
            isDisposed = false;
        }
        void IUnitOfWork.Commit()
        {
            this.dbContext.SaveChanges();
        }

        public async Task CommitAsync()
        {
            await this.dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            if (!isDisposed)
            {
                this.dbContext.Dispose();
                isDisposed = true;
            }
        }

        public DbContext GetDbContext()
        {
            return dbContext;
        }

        public async Task<IDbContextTransaction> GetDbTransactionAsync()
        {
            return await dbContext.Database.BeginTransactionAsync();
        }
        IDbContextTransaction IUnitOfWork.GetDbTransaction()
        {
            return dbContext.Database.BeginTransaction();
        }

        
    }
}
