using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SRSN.DatabaseManager.Entities
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

        public virtual DbSet<Accounts> Accounts { get; set; }
        public virtual DbSet<CategoryItem> CategoryItem { get; set; }
        public virtual DbSet<CategoryMain> CategoryMain { get; set; }
        public virtual DbSet<Collection> Collection { get; set; }
        public virtual DbSet<CollectionPost> CollectionPost { get; set; }
        public virtual DbSet<Comment> Comment { get; set; }
        public virtual DbSet<CommentLike> CommentLike { get; set; }
        public virtual DbSet<IngredientBrand> IngredientBrand { get; set; }
        public virtual DbSet<Ingredients> Ingredients { get; set; }
        public virtual DbSet<Message> Message { get; set; }
        public virtual DbSet<Notification> Notification { get; set; }
        public virtual DbSet<RatingRecipe> RatingRecipe { get; set; }
        public virtual DbSet<Recipe> Recipe { get; set; }
        public virtual DbSet<RecipeCategory> RecipeCategory { get; set; }
        public virtual DbSet<RecipeIngredient> RecipeIngredient { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<SharedPost> SharedPost { get; set; }
        public virtual DbSet<ShoppingList> ShoppingList { get; set; }
        public virtual DbSet<StepsOfRecipe> StepsOfRecipe { get; set; }
        public virtual DbSet<Store> Store { get; set; }
        public virtual DbSet<StoreBrand> StoreBrand { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserBlock> UserBlock { get; set; }
        public virtual DbSet<UserFollowing> UserFollowing { get; set; }
        public virtual DbSet<UserReportRecipe> UserReportRecipe { get; set; }
        public virtual DbSet<UserReportUser> UserReportUser { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=localhost;Database=CookyDemo;User Id=sa;Password=baongoc1997;Trusted_Connection=False;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.0-rtm-35687");

            modelBuilder.Entity<Accounts>(entity =>
            {
                entity.HasKey(e => e.Username);

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Accounts)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_Accounts_Role");
            });

            modelBuilder.Entity<CategoryItem>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CategoryMainId).HasColumnName("CategoryMainID");

                entity.HasOne(d => d.CategoryMain)
                    .WithMany(p => p.CategoryItem)
                    .HasForeignKey(d => d.CategoryMainId)
                    .HasConstraintName("FK_CategoryItem_CategoryMain");
            });

            modelBuilder.Entity<CategoryMain>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();
            });

            modelBuilder.Entity<Collection>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.Collection)
                    .HasForeignKey(d => d.Username)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Collection_User");
            });

            modelBuilder.Entity<CollectionPost>(entity =>
            {
                entity.HasKey(e => new { e.CollectionId, e.RecipePostId })
                    .HasName("PK_Collection_Post_1");

                entity.ToTable("Collection_Post");

                entity.HasOne(d => d.Collection)
                    .WithMany(p => p.CollectionPost)
                    .HasForeignKey(d => d.CollectionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Collection_Post_Collection");
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.SharePost)
                    .WithMany(p => p.Comment)
                    .HasForeignKey(d => d.SharePostId)
                    .HasConstraintName("FK_Comment_SharedPost");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.Comment)
                    .HasForeignKey(d => d.Username)
                    .HasConstraintName("FK_Comment_User");
            });

            modelBuilder.Entity<CommentLike>(entity =>
            {
                entity.HasKey(e => new { e.CommentId, e.Username });

                entity.ToTable("Comment_Like");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.Comment)
                    .WithMany(p => p.CommentLike)
                    .HasForeignKey(d => d.CommentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Comment_Like_Comment");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.CommentLike)
                    .HasForeignKey(d => d.Username)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Comment_Like_User");
            });

            modelBuilder.Entity<IngredientBrand>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

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

            modelBuilder.Entity<Ingredients>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.IngredientName).HasMaxLength(50);
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.CreatorId).HasMaxLength(50);

                entity.Property(e => e.RecipientId).HasMaxLength(50);

                entity.HasOne(d => d.Creator)
                    .WithMany(p => p.MessageCreator)
                    .HasForeignKey(d => d.CreatorId)
                    .HasConstraintName("FK_Message_User");

                entity.HasOne(d => d.Recipient)
                    .WithMany(p => p.MessageRecipient)
                    .HasForeignKey(d => d.RecipientId)
                    .HasConstraintName("FK_Message_User1");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.Notification)
                    .HasForeignKey(d => d.Username)
                    .HasConstraintName("FK_Notification_User");
            });

            modelBuilder.Entity<RatingRecipe>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.RatingRecipe)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_RatingRecipe_Recipe");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.RatingRecipe)
                    .HasForeignKey(d => d.Username)
                    .HasConstraintName("FK_RatingRecipe_User");
            });

            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.Property(e => e.CreateTime).HasColumnType("datetime");

                entity.Property(e => e.RecipeName).HasMaxLength(50);

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.Property(e => e.VideoLink).HasMaxLength(50);

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.Recipe)
                    .HasForeignKey(d => d.Username)
                    .HasConstraintName("FK_Recipe_User");
            });

            modelBuilder.Entity<RecipeCategory>(entity =>
            {
                entity.ToTable("Recipe_Category");

                entity.Property(e => e.Id).ValueGeneratedNever();

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

                entity.Property(e => e.Id).ValueGeneratedNever();

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

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.RoleName).HasMaxLength(50);
            });

            modelBuilder.Entity<SharedPost>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.SharedPost)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_SharedPost_RecipePost");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.SharedPost)
                    .HasForeignKey(d => d.Username)
                    .HasConstraintName("FK_SharedPost_User");
            });

            modelBuilder.Entity<ShoppingList>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.ShoppingList)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_ShoppingList_RecipePost");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.ShoppingList)
                    .HasForeignKey(d => d.Username)
                    .HasConstraintName("FK_ShoppingList_User");
            });

            modelBuilder.Entity<StepsOfRecipe>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.StepsOfRecipe)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_StepsOfRecipe_RecipePost");
            });

            modelBuilder.Entity<Store>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

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
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.Fanpage).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Website).HasMaxLength(50);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Username);

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Address).HasMaxLength(50);

                entity.Property(e => e.Birthdate).HasMaxLength(50);

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.Gender).HasMaxLength(50);

                entity.Property(e => e.LastName).HasMaxLength(50);

                entity.Property(e => e.Phone).HasMaxLength(50);

                entity.HasOne(d => d.UsernameNavigation)
                    .WithOne(p => p.User)
                    .HasForeignKey<User>(d => d.Username)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Accounts");
            });

            modelBuilder.Entity<UserBlock>(entity =>
            {
                entity.HasKey(e => new { e.Username, e.BlockedUsername })
                    .HasName("PK_User_Block_1");

                entity.ToTable("User_Block");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.Property(e => e.BlockedUsername).HasMaxLength(50);

                entity.HasOne(d => d.BlockedUsernameNavigation)
                    .WithMany(p => p.UserBlockBlockedUsernameNavigation)
                    .HasForeignKey(d => d.BlockedUsername)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Block_User1");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.UserBlockUsernameNavigation)
                    .HasForeignKey(d => d.Username)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Block_User");
            });

            modelBuilder.Entity<UserFollowing>(entity =>
            {
                entity.HasKey(e => new { e.Username, e.FollowingUser })
                    .HasName("PK_User_Following_1");

                entity.ToTable("User_Following");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.Property(e => e.FollowingUser).HasMaxLength(50);

                entity.HasOne(d => d.FollowingUserNavigation)
                    .WithMany(p => p.UserFollowingFollowingUserNavigation)
                    .HasForeignKey(d => d.FollowingUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Following_User1");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.UserFollowingUsernameNavigation)
                    .HasForeignKey(d => d.Username)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Following_User");
            });

            modelBuilder.Entity<UserReportRecipe>(entity =>
            {
                entity.HasKey(e => new { e.Username, e.RecipeReportedId })
                    .HasName("PK_User_Report_Recipe_1");

                entity.ToTable("User_Report_Recipe");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.UserReportRecipe)
                    .HasForeignKey(d => d.Username)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Report_Recipe_User");
            });

            modelBuilder.Entity<UserReportUser>(entity =>
            {
                entity.HasKey(e => new { e.Username, e.ReportedUsername })
                    .HasName("PK_User_Report_User_1");

                entity.ToTable("User_Report_User");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.Property(e => e.ReportedUsername).HasMaxLength(50);

                entity.HasOne(d => d.ReportedUsernameNavigation)
                    .WithMany(p => p.UserReportUserReportedUsernameNavigation)
                    .HasForeignKey(d => d.ReportedUsername)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Report_User_User1");

                entity.HasOne(d => d.UsernameNavigation)
                    .WithMany(p => p.UserReportUserUsernameNavigation)
                    .HasForeignKey(d => d.Username)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Report_User_User");
            });
        }
    }
}
