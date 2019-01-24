using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
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

        public virtual Accounts UsernameNavigation { get; set; }
        public virtual ICollection<Collection> Collection { get; set; }
        public virtual ICollection<Comment> Comment { get; set; }
        public virtual ICollection<CommentLike> CommentLike { get; set; }
        public virtual ICollection<Message> MessageCreator { get; set; }
        public virtual ICollection<Message> MessageRecipient { get; set; }
        public virtual ICollection<Notification> Notification { get; set; }
        public virtual ICollection<RatingRecipe> RatingRecipe { get; set; }
        public virtual ICollection<Recipe> Recipe { get; set; }
        public virtual ICollection<SharedPost> SharedPost { get; set; }
        public virtual ICollection<ShoppingList> ShoppingList { get; set; }
        public virtual ICollection<UserBlock> UserBlockBlockedUsernameNavigation { get; set; }
        public virtual ICollection<UserBlock> UserBlockUsernameNavigation { get; set; }
        public virtual ICollection<UserFollowing> UserFollowingFollowingUserNavigation { get; set; }
        public virtual ICollection<UserFollowing> UserFollowingUsernameNavigation { get; set; }
        public virtual ICollection<UserReportRecipe> UserReportRecipe { get; set; }
        public virtual ICollection<UserReportUser> UserReportUserReportedUsernameNavigation { get; set; }
        public virtual ICollection<UserReportUser> UserReportUserUsernameNavigation { get; set; }
    }
}
