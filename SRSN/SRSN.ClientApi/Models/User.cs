using System;
using System.Collections.Generic;

namespace SRSN.ClientApi.Models
{
    public partial class User
    {
        public User()
        {
            Collection = new HashSet<Collection>();
            Comment = new HashSet<Comment>();
            CommentLike = new HashSet<CommentLike>();
            MessageCreator = new HashSet<Message>();
            MessageRecipient = new HashSet<Message>();
            Notification = new HashSet<Notification>();
            RatingRecipe = new HashSet<RatingRecipe>();
            Recipe = new HashSet<Recipe>();
            SharedPost = new HashSet<SharedPost>();
            ShoppingList = new HashSet<ShoppingList>();
            UserBlockBlockedUsernameNavigation = new HashSet<UserBlock>();
            UserBlockUsernameNavigation = new HashSet<UserBlock>();
            UserFollowingFollowingUserNavigation = new HashSet<UserFollowing>();
            UserFollowingUsernameNavigation = new HashSet<UserFollowing>();
            UserReportRecipe = new HashSet<UserReportRecipe>();
            UserReportUserReportedUsernameNavigation = new HashSet<UserReportUser>();
            UserReportUserUsernameNavigation = new HashSet<UserReportUser>();
        }

        public string Username { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Description { get; set; }
        public string Birthdate { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public Accounts UsernameNavigation { get; set; }
        public ICollection<Collection> Collection { get; set; }
        public ICollection<Comment> Comment { get; set; }
        public ICollection<CommentLike> CommentLike { get; set; }
        public ICollection<Message> MessageCreator { get; set; }
        public ICollection<Message> MessageRecipient { get; set; }
        public ICollection<Notification> Notification { get; set; }
        public ICollection<RatingRecipe> RatingRecipe { get; set; }
        public ICollection<Recipe> Recipe { get; set; }
        public ICollection<SharedPost> SharedPost { get; set; }
        public ICollection<ShoppingList> ShoppingList { get; set; }
        public ICollection<UserBlock> UserBlockBlockedUsernameNavigation { get; set; }
        public ICollection<UserBlock> UserBlockUsernameNavigation { get; set; }
        public ICollection<UserFollowing> UserFollowingFollowingUserNavigation { get; set; }
        public ICollection<UserFollowing> UserFollowingUsernameNavigation { get; set; }
        public ICollection<UserReportRecipe> UserReportRecipe { get; set; }
        public ICollection<UserReportUser> UserReportUserReportedUsernameNavigation { get; set; }
        public ICollection<UserReportUser> UserReportUserUsernameNavigation { get; set; }
    }
}
