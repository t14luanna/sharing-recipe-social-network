using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.Identities
{
    public class SRSNIdentityDbContext : IdentityDbContext<SRSNUser>
    {

        public SRSNIdentityDbContext()
        {
        }

        public SRSNIdentityDbContext(DbContextOptions<SRSNIdentityDbContext> options)
            : base(options)
        {
        }

    }
}
