﻿using AutoMapper;
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

        Task<ICollection<AccountViewModel>> getAllFollowingUser(UserManager<SRSNUser> userManager, int userid);
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

        public async Task<ICollection<AccountViewModel>> getAllFollowingUser(UserManager<SRSNUser> userManager, int userid)
        {
            var listAccount = new List<AccountViewModel>();

            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE Active= 1 AND UserId=" + userid).ToListAsync();


            foreach (var item in listItems)
            {
                var user = await userManager.FindByIdAsync(item.FollowingUserId.ToString());
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);
                                
                listAccount.Add(userVM);
            }

            return listAccount;
        }
        
        public async Task<ICollection<UserFollowing>> unfollowFollowingUser(UserManager<SRSNUser> userManager, int userId, int followingUserId)
        {
            

            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE UserId=" + userId + " AND FollowingUserId=" + followingUserId).ToListAsync();
            
            foreach (var item in listItems)
            {
                item.Active = false;
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
                this.selfDbSet.Update(item);
            } 
            else
            {
                UserFollowing userFollowing = new UserFollowing();
                userFollowing.UserId = userId;
                userFollowing.FollowingUserId = followingUserId;
                userFollowing.Active = true;
                await this.selfDbSet.AddAsync(userFollowing);
            }
            await this.unitOfWork.CommitAsync();

            return listItems;
        }

        public async Task<ICollection<AccountViewModel>> getAllUserFollowingMe(UserManager<SRSNUser> userManager, int followingUserId)
        {
            var listAccount = new List<AccountViewModel>();
             
            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE Active='True' AND FollowingUserId=" + followingUserId).ToListAsync();

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
