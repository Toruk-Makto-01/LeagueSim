using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeagueSim.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixLeagueIdTypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matchs_Teams_AwayTeamId",
                table: "Matchs");

            migrationBuilder.DropForeignKey(
                name: "FK_Matchs_Teams_HomeTeamId",
                table: "Matchs");

            migrationBuilder.DropForeignKey(
                name: "FK_Matchs_Weeks_WeekId",
                table: "Matchs");

            migrationBuilder.DropForeignKey(
                name: "FK_Weeks_Leagues_LeagueId",
                table: "Weeks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Matchs",
                table: "Matchs");

            migrationBuilder.DropColumn(
                name: "LeaueId",
                table: "Weeks");

            migrationBuilder.RenameTable(
                name: "Matchs",
                newName: "Matches");

            migrationBuilder.RenameIndex(
                name: "IX_Matchs_WeekId",
                table: "Matches",
                newName: "IX_Matches_WeekId");

            migrationBuilder.RenameIndex(
                name: "IX_Matchs_HomeTeamId",
                table: "Matches",
                newName: "IX_Matches_HomeTeamId");

            migrationBuilder.RenameIndex(
                name: "IX_Matchs_AwayTeamId",
                table: "Matches",
                newName: "IX_Matches_AwayTeamId");

            migrationBuilder.AlterColumn<int>(
                name: "LeagueId",
                table: "Weeks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Matches",
                table: "Matches",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Teams_AwayTeamId",
                table: "Matches",
                column: "AwayTeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Teams_HomeTeamId",
                table: "Matches",
                column: "HomeTeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Weeks_WeekId",
                table: "Matches",
                column: "WeekId",
                principalTable: "Weeks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Weeks_Leagues_LeagueId",
                table: "Weeks",
                column: "LeagueId",
                principalTable: "Leagues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Teams_AwayTeamId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Teams_HomeTeamId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Weeks_WeekId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Weeks_Leagues_LeagueId",
                table: "Weeks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Matches",
                table: "Matches");

            migrationBuilder.RenameTable(
                name: "Matches",
                newName: "Matchs");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_WeekId",
                table: "Matchs",
                newName: "IX_Matchs_WeekId");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_HomeTeamId",
                table: "Matchs",
                newName: "IX_Matchs_HomeTeamId");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_AwayTeamId",
                table: "Matchs",
                newName: "IX_Matchs_AwayTeamId");

            migrationBuilder.AlterColumn<int>(
                name: "LeagueId",
                table: "Weeks",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "LeaueId",
                table: "Weeks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Matchs",
                table: "Matchs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Matchs_Teams_AwayTeamId",
                table: "Matchs",
                column: "AwayTeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Matchs_Teams_HomeTeamId",
                table: "Matchs",
                column: "HomeTeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Matchs_Weeks_WeekId",
                table: "Matchs",
                column: "WeekId",
                principalTable: "Weeks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Weeks_Leagues_LeagueId",
                table: "Weeks",
                column: "LeagueId",
                principalTable: "Leagues",
                principalColumn: "Id");
        }
    }
}
