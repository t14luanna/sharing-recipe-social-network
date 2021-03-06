﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SRSN.Service.Entities
{
    public partial class CookyDemoContext : DbContext
    {
        public CookyDemoContext()
        {
        }

        public CookyDemoContext(DbContextOptions<CookyDemoContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AspNetRoleClaims> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUserTokens> AspNetUserTokens { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<CategoryItem> CategoryItem { get; set; }
        public virtual DbSet<CategoryMain> CategoryMain { get; set; }
        public virtual DbSet<Collection> Collection { get; set; }
        public virtual DbSet<CollectionPost> CollectionPost { get; set; }
        public virtual DbSet<Comment> Comment { get; set; }
        public virtual DbSet<CommentLike> CommentLike { get; set; }
        public virtual DbSet<IngredientBrand> IngredientBrand { get; set; }
        public virtual DbSet<IngredientList> IngredientList { get; set; }
        public virtual DbSet<Ingredients> Ingredients { get; set; }
        public virtual DbSet<Message> Message { get; set; }
        public virtual DbSet<Notification> Notification { get; set; }
        public virtual DbSet<Post> Post { get; set; }
        public virtual DbSet<RatingRecipe> RatingRecipe { get; set; }
        public virtual DbSet<Recipe> Recipe { get; set; }
        public virtual DbSet<RecipeCategory> RecipeCategory { get; set; }
        public virtual DbSet<RecipeIngredient> RecipeIngredient { get; set; }
        public virtual DbSet<StepsOfRecipe> StepsOfRecipe { get; set; }
        public virtual DbSet<Store> Store { get; set; }
        public virtual DbSet<StoreBrand> StoreBrand { get; set; }
        public virtual DbSet<UserBlock> UserBlock { get; set; }
        public virtual DbSet<UserFollowing> UserFollowing { get; set; }
        public virtual DbSet<UserReportRecipe> UserReportRecipe { get; set; }
        public virtual DbSet<UserReportUser> UserReportUser { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.1-servicing-10028");

            modelBuilder.Entity<AspNetRoleClaims>(entity =>
            {
                entity.HasIndex(e => e.RoleId);

                entity.Property(e => e.RoleId).IsRequired();

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetRoles>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName)
                    .HasName("RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetUserClaims>(entity =>
            {
                entity.HasIndex(e => e.UserId);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogins>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserRoles>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.HasIndex(e => e.RoleId);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.RoleId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserTokens>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail)
                    .HasName("EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName)
                    .HasName("UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            modelBuilder.Entity<CategoryItem>(entity =>
            {
                entity.Property(e => e.CategoryMainId).HasColumnName("CategoryMainID");

                entity.HasOne(d => d.CategoryMain)
                    .WithMany(p => p.CategoryItem)
                    .HasForeignKey(d => d.CategoryMainId)
                    .HasConstraintName("FK_CategoryItem_CategoryMain");
            });

            modelBuilder.Entity<Collection>(entity =>
            {
                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Collection)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Collection_AspNetUsers");
            });

            modelBuilder.Entity<CollectionPost>(entity =>
            {
                entity.HasKey(e => new { e.CollectionId, e.RecipePostId })
                    .HasName("PK_Collection_Post_1");

                entity.ToTable("Collection_Post");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.HasOne(d => d.Collection)
                    .WithMany(p => p.CollectionPost)
                    .HasForeignKey(d => d.CollectionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Collection_Post_Collection");

                entity.HasOne(d => d.RecipePost)
                    .WithMany(p => p.CollectionPost)
                    .HasForeignKey(d => d.RecipePostId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Collection_Post_Recipe");
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.UpdateTime).HasColumnType("datetime");

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.Post)
                    .WithMany(p => p.Comment)
                    .HasForeignKey(d => d.PostId)
                    .HasConstraintName("FK_Comment_Post");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Comment)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Comment_AspNetUsers");
            });

            modelBuilder.Entity<CommentLike>(entity =>
            {
                entity.ToTable("Comment_Like");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.Comment)
                    .WithMany(p => p.CommentLike)
                    .HasForeignKey(d => d.CommentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Comment_Like_Comment");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.CommentLike)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Comment_Like_AspNetUsers");
            });

            modelBuilder.Entity<IngredientBrand>(entity =>
            {
                entity.Property(e => e.ImageUrl).HasMaxLength(50);

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.IngredientBrand)
                    .HasForeignKey(d => d.IngredientId)
                    .HasConstraintName("FK_IngredientBrand_Ingredients");

                entity.HasOne(d => d.Store)
                    .WithMany(p => p.IngredientBrand)
                    .HasForeignKey(d => d.StoreId)
                    .HasConstraintName("FK_IngredientBrand_Store");
            });

            modelBuilder.Entity<IngredientList>(entity =>
            {
                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.IngredientList)
                    .HasForeignKey(d => d.IngredientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_IngredientList_Ingredients");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.IngredientList)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_ShoppingList_RecipePost");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.IngredientList)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_ShoppingList_AspNetUsers");
            });

            modelBuilder.Entity<Ingredients>(entity =>
            {
                entity.Property(e => e.IngredientName).HasMaxLength(50);
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.CreatorId).HasMaxLength(50);

                entity.Property(e => e.RecipientId).HasMaxLength(450);

                entity.HasOne(d => d.Recipient)
                    .WithMany(p => p.Message)
                    .HasForeignKey(d => d.RecipientId)
                    .HasConstraintName("FK_Message_AspNetUsers");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.IsRead).HasColumnName("isRead");

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Notification)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Notification_AspNetUsers");
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.Post)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_SharedPost_RecipePost");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Post)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_SharedPost_AspNetUsers");
            });

            modelBuilder.Entity<RatingRecipe>(entity =>
            {
                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.RatingRecipe)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_RatingRecipe_Recipe");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.RatingRecipe)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_RatingRecipe_AspNetUsers");
            });

            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.RecipeName).HasMaxLength(50);

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.Property(e => e.VideoLink).HasMaxLength(50);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Recipe)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Recipe_AspNetUsers");
            });

            modelBuilder.Entity<RecipeCategory>(entity =>
            {
                entity.ToTable("Recipe_Category");

                entity.HasOne(d => d.CategoryItem)
                    .WithMany(p => p.RecipeCategory)
                    .HasForeignKey(d => d.CategoryItemId)
                    .HasConstraintName("FK_Recipe_Category_CategoryItem");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.RecipeCategory)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_Recipe_Category_Recipe");
            });

            modelBuilder.Entity<RecipeIngredient>(entity =>
            {
                entity.ToTable("Recipe_Ingredient");

                entity.Property(e => e.Quantitative).HasMaxLength(50);

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.RecipeIngredient)
                    .HasForeignKey(d => d.IngredientId)
                    .HasConstraintName("FK_Recipe_Ingredient_Ingredients");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.RecipeIngredient)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_Recipe_Ingredient_Recipe");
            });

            modelBuilder.Entity<StepsOfRecipe>(entity =>
            {
                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.StepsOfRecipe)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_StepsOfRecipe_RecipePost");
            });

            modelBuilder.Entity<Store>(entity =>
            {
                entity.Property(e => e.Address).HasMaxLength(50);

                entity.Property(e => e.Lat).HasMaxLength(10);

                entity.Property(e => e.Long).HasMaxLength(10);

                entity.Property(e => e.Phone).HasMaxLength(50);

                entity.Property(e => e.StoreName).HasMaxLength(50);

                entity.HasOne(d => d.Brand)
                    .WithMany(p => p.Store)
                    .HasForeignKey(d => d.BrandId)
                    .HasConstraintName("FK_Store_StoreBrand");
            });

            modelBuilder.Entity<StoreBrand>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.Fanpage).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Website).HasMaxLength(50);
            });

            modelBuilder.Entity<UserBlock>(entity =>
            {
                entity.ToTable("User_Block");

                entity.HasIndex(e => new { e.UserId, e.BlockedUserId })
                    .HasName("UC_UserBlock")
                    .IsUnique();

                entity.Property(e => e.BlockedUserId).IsRequired();

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserBlock)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Block_AspNetUsers");
            });

            modelBuilder.Entity<UserFollowing>(entity =>
            {
                entity.ToTable("User_Following");

                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.FollowingUserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.IsActive).HasColumnName("isActive");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.FollowingUser)
                    .WithMany(p => p.UserFollowingFollowingUser)
                    .HasForeignKey(d => d.FollowingUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Following_AspNetUsers1");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserFollowingUser)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Following_AspNetUsers");
            });

            modelBuilder.Entity<UserReportRecipe>(entity =>
            {
                entity.ToTable("User_Report_Recipe");

                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.IsActive).HasColumnName("isActive");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserReportRecipe)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Report_Recipe_AspNetUsers");
            });

            modelBuilder.Entity<UserReportUser>(entity =>
            {
                entity.ToTable("User_Report_User");

                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.ReportedUserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.ReportedUser)
                    .WithMany(p => p.UserReportUserReportedUser)
                    .HasForeignKey(d => d.ReportedUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Report_User_AspNetUsers1");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserReportUserUser)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Report_User_AspNetUsers");
            });
        }
    }
}
