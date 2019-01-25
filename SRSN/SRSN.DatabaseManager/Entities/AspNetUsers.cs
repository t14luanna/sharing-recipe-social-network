using System;
using System.Collections.Generic;

namespace SRSN.DatabaseManager.Entities
{
    public partial class AspNetUsers
    {
        public AspNetUsers()
        {
            AspNetUserClaims = new HashSet<AspNetUserClaims>();
            AspNetUserLogins = new HashSet<AspNetUserLogins>();
            AspNetUserRoles = new HashSet<AspNetUserRoles>();
            AspNetUserTokens = new HashSet<AspNetUserTokens>();
            Collection = new HashSet<Collection>();
            Comment = new HashSet<Comment>();
            CommentLike = new HashSet<CommentLike>();
            Message = new HashSet<Message>();
            Notification = new HashSet<Notification>();
            RatingRecipe = new HashSet<RatingRecipe>();
            Recipe = new HashSet<Recipe>();
            SharedPost = new HashSet<SharedPost>();
            ShoppingList = new HashSet<ShoppingList>();
            UserBlock = new HashSet<UserBlock>();
            UserFollowingFollowingUser = new HashSet<UserFollowing>();
            UserFollowingUser = new HashSet<UserFollowing>();
            UserReportRecipe = new HashSet<UserReportRecipe>();
            UserReportUserReportedUser = new HashSet<UserReportUser>();
            UserReportUserUser = new HashSet<UserReportUser>();
        }

        public string Id { get; set; }
        public string UserName { get; set; }
        public string NormalizedUserName { get; set; }
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public string ConcurrencyStamp { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }

        public virtual ICollection<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual ICollection<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual ICollection<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual ICollection<AspNetUserTokens> AspNetUserTokens { get; set; }
        public virtual ICollection<Collection> Collection { get; set; }
        public virtual ICollection<Comment> Comment { get; set; }
        public virtual ICollection<CommentLike> CommentLike { get; set; }
        public virtual ICollection<Message> Message { get; set; }
        public virtual ICollection<Notification> Notification { get; set; }
        public virtual ICollection<RatingRecipe> RatingRecipe { get; set; }
        public virtual ICollection<Recipe> Recipe { get; set; }
        public virtual ICollection<SharedPost> SharedPost { get; set; }
        public virtual ICollection<ShoppingList> ShoppingList { get; set; }
        public virtual ICollection<UserBlock> UserBlock { get; set; }
        public virtual ICollection<UserFollowing> UserFollowingFollowingUser { get; set; }
        public virtual ICollection<UserFollowing> UserFollowingUser { get; set; }
        public virtual ICollection<UserReportRecipe> UserReportRecipe { get; set; }
        public virtual ICollection<UserReportUser> UserReportUserReportedUser { get; set; }
        public virtual ICollection<UserReportUser> UserReportUserUser { get; set; }
    }
}
