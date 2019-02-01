using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.Identities
{
    public class SRSNIdentityDbContext : IdentityDbContext<SRSNUser, IdentityRole<int>, int>
    {

        public SRSNIdentityDbContext()
        {
        }

        public SRSNIdentityDbContext(DbContextOptions<SRSNIdentityDbContext> options)
            : base(options)
        {
            
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Config db context manually
            optionsBuilder.UseSqlServer("Server=localhost;Database=CookyDemo;User Id=sa;Password=12345678;Trusted_Connection=False;");
        }
    }
}
