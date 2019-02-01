using SRSN.DatabaseManager.Identities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.ViewModels
{
    public class UserBlockViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BlockedUserId { get; set; }

        public AccountEditViewModel BlockedUserVM { get; set; }

    }
}
