using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.Identities
{
    public class SRSNUserManager : UserManager<SRSNUser>
    {
        public SRSNUserManager(IUserStore<SRSNUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<SRSNUser> passwordHasher, IEnumerable<IUserValidator<SRSNUser>> userValidators, IEnumerable<IPasswordValidator<SRSNUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<SRSNUser>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }
    }
}
