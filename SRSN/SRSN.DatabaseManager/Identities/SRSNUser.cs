using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SRSN.DatabaseManager.ViewModels;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SRSN.DatabaseManager.Identities
{
    public class SRSNUser : IdentityUser<int>
    {

        public string Description { get; set; }
        /// <summary>
        /// GENDER ENum may be,
        /// must implement
        /// </summary>
        public int Gender { get; set; }
        public DateTime? Birthdate { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Point { get; set; }
        public bool Active { get; set; }
        // them o day ne
        public string AvatarImageUrl { get; set; }
        /// <summary>
        /// Cai ham nay co the tao ra cho controller 1 cai accesstoken de ho tra ve cho nguopi dung
        /// </summary>
        /// <param name="userManager"></param>
        /// <param name="user"></param>
        /// <returns></returns> 
        public async Task<dynamic> AuthorizeAsync(UserManager<SRSNUser> userManager, SRSNUser user)
        {
            // This step: de danh cau hinh claim (payload) cho token
            var userRoles = await userManager.GetRolesAsync(user);
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            foreach (var userRole in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            // This step: de cau hinh cai Signature
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.Default.GetBytes("@everyone:SRSNSecret!");
            var issuer = "http://srsn.com";
            var audience = "http://srsn.com";

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Issuer = issuer,
                Audience = audience,
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(7).AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new
            {
                token = tokenString,
                userAddress = user.Address,
                validTo = token.ValidTo,
                validFrom = token.ValidFrom
            };
        }
    }

    
}
