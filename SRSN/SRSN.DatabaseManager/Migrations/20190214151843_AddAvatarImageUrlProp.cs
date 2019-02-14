using Microsoft.EntityFrameworkCore.Migrations;

namespace SRSN.DatabaseManager.Migrations
{
    public partial class AddAvatarImageUrlProp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AvatarImageUrl",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarImageUrl",
                table: "AspNetUsers");
        }
    }
}
