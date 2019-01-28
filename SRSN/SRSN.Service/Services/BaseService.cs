using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SRSN.Service.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using AutoMapper.QueryableExtensions;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace SRSN.Service.Services
{

    /// <summary>
    /// Class nay giong nhu abstract class 
    /// ho tro cho viec tao Service 1 cach nhanh nhat
    /// Nhan request vao View Model va xu ly Entity
    /// </summary>
    public class BaseService<TEntity, TViewModel> : IBaseService<TEntity, TViewModel>
        where TEntity : class, new()
        where TViewModel : class, new()
    {
        // O day minh phai implement 1 ham khac noai service co san, nen minh can phai dung unit of work va mapper va dbset
        // doi toan bo private thanh protected
        protected IUnitOfWork unitOfWork;
        protected IMapper mapper;
        protected DbSet<TEntity> selfDbSet;

        public BaseService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.selfDbSet = unitOfWork.GetDbContext().Set<TEntity>();
        }

        #region
        protected TEntity VMToEntity(TViewModel data)
        {
            var entity = new TEntity();
            var vm = mapper.Map<TViewModel, TEntity>(data, entity);
            return entity;
        }
        protected TViewModel EntityToVM(TEntity data)
        {
            var vm = new TViewModel();
            var entity = mapper.Map<TEntity, TViewModel>(data, vm);
            return vm;
        }

        protected GEntity VMToEntity<GEntity, GViewModel>(GViewModel data)
            where GEntity : class, new()
        {
            var entity = new GEntity();
            var vm = mapper.Map<GViewModel, GEntity>(data, entity);
            return entity;
        }
        protected GViewModel EntityToVM<GEntity, GViewModel>(GEntity data)
          where GViewModel : class, new()
        {
            var viewModel = new GViewModel();
            var vm = mapper.Map<GEntity, GViewModel>(data, viewModel);
            return viewModel;
        }
        #endregion

        public async Task<TViewModel> CreateAsync(TViewModel data)
        {
            var entity = VMToEntity(data);
            await selfDbSet.AddAsync(entity);
            await unitOfWork.Commit();
            var newVM = EntityToVM(entity);
            return newVM;
        }

        public async Task DeleteAsync(TViewModel data)
        {
            var entity = VMToEntity(data);
            selfDbSet.Remove(entity);
            await unitOfWork.Commit();
            var newVM = EntityToVM(entity);
        }

        public IQueryable<TViewModel> Get()
        {
            var list = selfDbSet.AsNoTracking();
            var listVM = list.ProjectTo<TViewModel>(this.mapper.ConfigurationProvider);
            return listVM;
        }

        public IQueryable<TViewModel> Get(Expression<Func<TEntity, bool>> predicate)
        {
            var list = selfDbSet.AsNoTracking().Where(predicate);
            var listVM = list.ProjectTo<TViewModel>(this.mapper.ConfigurationProvider);
            return listVM;
        }

        public async Task<TViewModel> UpdateAsync(TViewModel data)
        {
            var entity = VMToEntity(data);
            selfDbSet.Update(entity);
            await unitOfWork.Commit();
            var newVM = EntityToVM(entity);
            return newVM;

        }

        public async Task<TViewModel> FirstOrDefaultAsync()
        {
            var entity = await selfDbSet.AsNoTracking().FirstOrDefaultAsync();
            var vm = EntityToVM(entity);
            return vm;
        }

        public async Task<TViewModel> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var entity = await selfDbSet.AsNoTracking().FirstOrDefaultAsync(predicate);
            var vm = EntityToVM(entity);
            return vm;
        }
    }
}
