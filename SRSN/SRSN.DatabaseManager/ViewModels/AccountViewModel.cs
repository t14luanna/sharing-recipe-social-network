using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{

    public class ChangePasswordViewModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class AccountEditViewModel
    {
        public string UsernameVM { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public int Gender { get; set; }
        public DateTime? Birthdate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Point { get; set; }

        public string AvatarImageUrl { get; set; }

    }

    public class AccountViewModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public int Gender { get; set; }
        public DateTime? Birthdate { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Point { get; set; }
        public string AvatarImageUrl { get; set; }
    }
}
