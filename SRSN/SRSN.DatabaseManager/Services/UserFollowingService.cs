using AutoMapper;
using AutoMapper.QueryableExtensions;
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
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IUserFollowingService : IBaseService<UserFollowing, AccountViewModel>
    {
        Task<ICollection<int>> GetAllFollowingUser(int userid);

        Task<ICollection<AccountViewModel>> getAllFollowUser(UserManager<SRSNUser> userManager, int userid, int limit, int page);
        IQueryable<AccountViewModel> GetAllFollowUser(int userId, int limit, int page);
        Task<ICollection<AccountViewModel>> GetAllFollowUser(UserManager<SRSNUser> userManager, int userId, string followedUsername, int limit, int page);
        Task<UserFollowingViewModel> checkFollowingUser(int userId, int followingUserId);
        Task<ICollection<UserFollowing>> unfollowFollowingUser(UserManager<SRSNUser> userManager, int userId, int followingUserId);
        Task<ICollection<AccountViewModel>> getAllUserFollowingMe(UserManager<SRSNUser> userManager, int followingUserId);//get all user who is following me
        Task<ICollection<UserFollowing>> followUser(UserManager<SRSNUser> userManager, int userId, int followingUserId);
    }
    public class UserFollowingService : BaseService<UserFollowing, AccountViewModel>, IUserFollowingService
    {
        public UserFollowingService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }


        public async Task<ICollection<AccountViewModel>> getAllFollowUser(UserManager<SRSNUser> userManager, int userId, int limit, int page)
        {
            var listAccount = new List<AccountViewModel>();

            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE Active= 1 AND UserId=" + userId).ToListAsync();

            listItems = listItems.Skip(page * limit).Take(limit).ToList();
            foreach (var item in listItems)
            {
                var user = await userManager.FindByIdAsync(item.FollowingUserId.ToString());
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);

                listAccount.Add(userVM);
            }

            return listAccount;
        }


        public IQueryable<AccountViewModel> GetAllFollowUser(int userId, int limit, int page)
        {
            var listAccount = new List<AccountViewModel>();

            var listItems = this.selfDbSet
                                        .AsNoTracking()
                                        .Where(x => x.Active.Value
                                                    && x.UserId == userId)
                                        .OrderByDescending(x => x.CreateTime.GetValueOrDefault())
                                        .Skip(page * limit)
                                        .Take(limit);

            var result = listItems
                .Select(x => x.FollowingUser)
                .ProjectTo<AccountViewModel>(this.mapper.ConfigurationProvider);

            return result;
        }
        public async Task<ICollection<AccountViewModel>> GetAllFollowUser(UserManager<SRSNUser> userManager, int userId, string followedUsername, int limit, int page)
        {
            var listAccount = new List<AccountViewModel>();

            var listItems = this.selfDbSet
                                        .AsNoTracking()
                                        .Where(x => x.Active.Value
                                                    && x.UserId == userId
                                                    && ($"{x.FollowingUser.LastName} {x.FollowingUser.FirstName}").Contains(followedUsername, StringComparison.OrdinalIgnoreCase))
                                        .OrderByDescending(x => x.CreateTime.GetValueOrDefault())
                                        .Skip(page * limit)
                                        .Take(limit);

            var result = await listItems
                .Select(x => x.FollowingUser)
                .ProjectTo<AccountViewModel>(this.mapper.ConfigurationProvider)
                .ToListAsync();

            return result;
        }

        public async Task<ICollection<UserFollowing>> unfollowFollowingUser(UserManager<SRSNUser> userManager, int userId, int followingUserId)
        {


            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE UserId=" + userId + " AND FollowingUserId=" + followingUserId).ToListAsync();

            foreach (var item in listItems)
            {
                item.Active = false;
                item.CreateTime = DateTime.UtcNow.AddHours(7);
                this.selfDbSet.Update(item);
                await this.unitOfWork.CommitAsync();
            }

            return listItems;
        }

        public async Task<ICollection<UserFollowing>> followUser(UserManager<SRSNUser> userManager, int userId, int followingUserId)
        {


            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE UserId=" + userId + " AND FollowingUserId=" + followingUserId).ToListAsync();

            if (listItems != null && listItems.Count != 0)
            {
                var item = listItems[0];
                item.Active = true;
                item.CreateTime = DateTime.UtcNow.AddHours(7);
                this.selfDbSet.Update(item);
            }
            else
            {
                UserFollowing userFollowing = new UserFollowing();
                userFollowing.UserId = userId;
                userFollowing.FollowingUserId = followingUserId;
                userFollowing.CreateTime = DateTime.UtcNow.AddHours(7);
                userFollowing.Active = true;
                await this.selfDbSet.AddAsync(userFollowing);
            }
            await this.unitOfWork.CommitAsync();

            return listItems;
        }

        public async Task<ICollection<AccountViewModel>> getAllUserFollowingMe(UserManager<SRSNUser> userManager, int followingUserId)
        {
            var listAccount = new List<AccountViewModel>();

            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE  Active= 1 AND UserId=" + followingUserId).ToListAsync();

            foreach (var item in listItems)
            {
                var user = await userManager.FindByIdAsync(item.UserId.ToString());
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);

                listAccount.Add(userVM);
            }

            return listAccount;
        }

        public async Task<ICollection<int>> GetAllFollowingUser(int userid)
        {
            var listItems = this.selfDbSet.AsNoTracking().Where(x => x.UserId == userid && x.Active == true);
            var listIds = await listItems.Select(x => x.FollowingUserId).ToListAsync();
            return listIds;
        }

        public async Task<UserFollowingViewModel> checkFollowingUser(int userId, int followingUserId)
        {
            var userFollowingEntity = await this.selfDbSet.AsNoTracking().Where(p => p.UserId == userId && p.FollowingUserId == followingUserId).FirstOrDefaultAsync();
            var userFollowingVM = new UserFollowingViewModel();
            mapper.Map(userFollowingEntity, userFollowingVM);
            return userFollowingVM;
        }
    }
}
