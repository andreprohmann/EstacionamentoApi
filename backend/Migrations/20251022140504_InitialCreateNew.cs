using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EstacionamentoApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumeroVaga",
                table: "Vagas");

            migrationBuilder.DropColumn(
                name: "Placa",
                table: "Vagas");

            migrationBuilder.AddColumn<string>(
                name: "Numero",
                table: "Vagas",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Numero",
                table: "Vagas");

            migrationBuilder.AddColumn<int>(
                name: "NumeroVaga",
                table: "Vagas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Placa",
                table: "Vagas",
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
