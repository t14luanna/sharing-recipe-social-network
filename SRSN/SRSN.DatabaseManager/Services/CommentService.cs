using AutoMapper;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface ICommentService : IBaseService<Comment, CommentViewModel>
    {
        Task DeActiveComment(int id);
    }

    public class CommentService : BaseService<Comment, CommentViewModel>, ICommentService
    {
        public CommentService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task DeActiveComment(int id)
        {
            var comment = await this.selfDbSet.FindAsync(id);
            comment.Active = false;
            this.selfDbSet.Update(comment);
            await this.unitOfWork.CommitAsync();
        }

        public IQueryable<object> GetAllCommentByPostId(int postId)
        {
            var post = this.unitOfWork.GetDbContext().Set<Comment>().Where(x => x.PostId == postId);
            return post;
        }
    }
}
