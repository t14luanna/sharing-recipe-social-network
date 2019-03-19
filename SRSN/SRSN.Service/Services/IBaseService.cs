using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace SRSN.Service.Services
{
    public interface IBaseService<TEntity, TViewModel>
        where TEntity : class, new()
        where TViewModel : class, new()
    {
        IQueryable<TViewModel> Get();
        IQueryable<TViewModel> Get(Expression<Func<TEntity, bool>> predicate);
        Task<TViewModel> CreateAsync(TViewModel data);
        Task<TViewModel> UpdateAsync(TViewModel data);
        Task DeleteAsync(TViewModel data);
        Task<TViewModel> FirstOrDefaultAsync();
        Task<TViewModel> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);

    }
}