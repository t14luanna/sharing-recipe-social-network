using AutoMapper;
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

    public interface IPostService : IBaseService<Post, PostViewModel>
    {
        Task DeActivatePost(int Id);
    }

    public class PostService : BaseService<Post, PostViewModel>, IPostService
    { 
    
        public PostService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task DeActivatePost(int Id)
        {
            var post = await selfDbSet.FindAsync(Id);
            post.Active = false;
            this.selfDbSet.Update(post);
            await unitOfWork.CommitAsync();
        }

        public IQueryable<object> GetAllPostByUserId(int userId)
        {
            var user = this.unitOfWork.GetDbContext().Set<Post>().Where(x => x.UserId == userId);
            return user;
        }
    }
}


