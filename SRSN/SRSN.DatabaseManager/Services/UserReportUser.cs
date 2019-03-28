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
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Services
{
    public interface IUserReportUserService : IBaseService<UserReportUser, UserReportUserViewModel>
    {
        Task<ICollection<UserReportUserViewModel>> GetAllReportedUser(UserManager<SRSNUser> userManager);
    }
    public class UserReportUserService : BaseService<UserReportUser, UserReportUserViewModel>, IUserReportUserService
    {
        public UserReportUserService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {

        }

        public async Task<ICollection<UserReportUserViewModel>> GetAllReportedUser(UserManager<SRSNUser> userManager)
        {
            var listReport = new List<UserReportUserViewModel>();
            var listReportEntity = this.selfDbSet.AsNoTracking().OrderByDescending(p => p.CreateTime).ToList();
            foreach (var item in listReportEntity)
            {
                var username = userManager.FindByIdAsync(item.UserId.ToString()).Result.UserName;
                var reportedUser = userManager.FindByIdAsync(item.ReportedUserId.ToString()).Result;
                var reportedUsername = reportedUser.UserName;
                //var statusOfReportedUser = reportedUser.isActive;
                var userReportedUserVM = this.EntityToVM(item);
                userReportedUserVM.Username = username;
                userReportedUserVM.ReportedUsername = reportedUsername;
                listReport.Add(userReportedUserVM);
            }
            return listReport;
        }
    }
}
