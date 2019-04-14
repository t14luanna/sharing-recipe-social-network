using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SRSN.DatabaseManager.Entities;
using SRSN.DatabaseManager.Identities;
using SRSN.DatabaseManager.ViewModels;
using SRSN.Service.Repositories;
using SRSN.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface ICommentService : IBaseService<Comment, CommentViewModel>
    {
        Task DeActiveComment(int id);
        Task<ICollection<CommentViewModel>> GetAllCommentByParentCommentId(UserManager<SRSNUser> userManager, int recipeId, int recipeParentId);
        Task<ICollection<CommentViewModel>> GetAllCommentByRecipeId(UserManager<SRSNUser> userManager, int recipeId);
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

        public async Task<ICollection<CommentViewModel>> GetAllCommentByParentCommentId(UserManager<SRSNUser> userManager, int recipeId, int recipeParentId)
        {
            try
            {
                var list = new List<CommentViewModel>();
                var listItems = this.selfDbSet.AsNoTracking().Where(p => p.RecipeId == recipeId && p.RecipeCommentParentId == recipeParentId && p.Active == true).ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";

                    // apply automapper 
                    var commentViewModel = this.EntityToVM(item);
                    // da co duoc du lieu cua entity trong view model cap nhat them vai field dac biet nhu la fullname chi viewmodel moi co
                    commentViewModel.FullName = fullName;
                    commentViewModel.AvatarUrl = currentUser.AvatarImageUrl;
                    list.Add(commentViewModel);

                }
                return list;

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IQueryable<object> GetAllCommentByPostId(int postId)
        {
            var post = this.unitOfWork.GetDbContext().Set<Comment>().Where(x => x.PostId == postId && x.Active == true);
            return post;
        }

        public async Task<ICollection<CommentViewModel>> GetAllCommentByRecipeId(UserManager<SRSNUser> userManager, int recipeId)
        {
            try
            {
                var list = new List<CommentViewModel>();
                var listItems = this.selfDbSet.AsNoTracking().Where(p => p.RecipeId == recipeId && p.Active == true).ToList();
                foreach (var item in listItems)
                {
                    // hien tai o day user manager bi null roi khong dung duoc nen ta phai truyen tu ngoai vao
                    var currentUser = userManager.FindByIdAsync(item.UserId.ToString()).Result;
                    var fullName = $"{currentUser.FirstName} {currentUser.LastName}";
                    var commentViewModel = this.EntityToVM(item);
                    if (item.CommentParentId != null)
                    {
                       var commentParent = this.selfDbSet.AsNoTracking().Where(p => p.Id == item.CommentParentId).FirstOrDefault();
                       var ownerUser = userManager.FindByIdAsync(commentParent.UserId.ToString()).Result;
                       var fullNameOwner = $"{ownerUser.FirstName} {ownerUser.LastName}";
                        commentViewModel.FullNameOwnerComment = fullNameOwner;
                        commentViewModel.UsernameOwnerComment = ownerUser.UserName;
                    }
                    commentViewModel.FullName = fullName;
                    commentViewModel.Username = currentUser.UserName;
                    commentViewModel.AvatarUrl = currentUser.AvatarImageUrl;
                    list.Add(commentViewModel);

                }
                return list;

            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
