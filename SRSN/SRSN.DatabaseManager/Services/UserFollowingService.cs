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
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IUserFollowingService : IBaseService<UserFollowing, AccountViewModel>
    {
        Task<ICollection<AccountViewModel>> getAllFollowingUser(UserManager<SRSNUser> userManager, int userid);
    }
    public class UserFollowingService : BaseService<UserFollowing, AccountViewModel>, IUserFollowingService
    {
        public UserFollowingService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }

        public async Task<ICollection<AccountViewModel>> getAllFollowingUser(UserManager<SRSNUser> userManager, int userid)
        {
            var listAccount = new List<AccountViewModel>();

            var listItems = await this.selfDbSet.AsNoTracking().FromSql("SELECT * FROM User_Following WHERE Active='True' AND UserId=" + userid).ToListAsync();
            
            foreach (var item in listItems)
            {
                var user = await userManager.FindByIdAsync(item.FollowingUserId.ToString());
                var userVM = new AccountViewModel();
                mapper.Map(user, userVM);
                                
                listAccount.Add(userVM);
            }

            return listAccount;
        }
    }
}