using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Identities
{
    public class SRSNUserManager : UserManager<SRSNUser>
    {
        public SRSNUserManager(IUserStore<SRSNUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<SRSNUser> passwordHasher, IEnumerable<IUserValidator<SRSNUser>> userValidators, IEnumerable<IPasswordValidator<SRSNUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<SRSNUser>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }


        /// <summary>
        /// Increase point to user by user id
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="point"></param>
        /// <returns></returns>
        public async Task<int> IncreasePoint(SRSNUser user, int point)
        {
            try
            {
                if(user.Point == null)
                {
                    user.Point = 0;
                }
                user.Point += point;
                var result = this.UpdateAsync(user).Result;
                return 1;
            }
            catch (Exception ex)
            {
                return -1;
            }
        }
    }
}
