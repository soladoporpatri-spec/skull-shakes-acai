using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SkullShakes.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMotoboysAndSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ScheduleJson",
                table: "StoreSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "UseAutoSchedule",
                table: "StoreSettings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Produtos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImagemUrl",
                table: "Produtos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsAtivo",
                table: "Produtos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MotoboyId",
                table: "Pedidos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisponivel",
                table: "Adicionais",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Motoboys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Telefone = table.Column<string>(type: "text", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Motoboys", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Adicionais",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsDisponivel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Adicionais",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsDisponivel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Adicionais",
                keyColumn: "Id",
                keyValue: 3,
                column: "IsDisponivel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Adicionais",
                keyColumn: "Id",
                keyValue: 4,
                column: "IsDisponivel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Adicionais",
                keyColumn: "Id",
                keyValue: 5,
                column: "IsDisponivel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Adicionais",
                keyColumn: "Id",
                keyValue: 6,
                column: "IsDisponivel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Categoria", "ImagemUrl", "IsAtivo" },
                values: new object[] { "", "", true });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Categoria", "ImagemUrl", "IsAtivo" },
                values: new object[] { "", "", true });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Categoria", "ImagemUrl", "IsAtivo" },
                values: new object[] { "", "", true });

            migrationBuilder.UpdateData(
                table: "StoreSettings",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ScheduleJson", "UseAutoSchedule" },
                values: new object[] { "{}", false });

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_MotoboyId",
                table: "Pedidos",
                column: "MotoboyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_Motoboys_MotoboyId",
                table: "Pedidos",
                column: "MotoboyId",
                principalTable: "Motoboys",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_Motoboys_MotoboyId",
                table: "Pedidos");

            migrationBuilder.DropTable(
                name: "Motoboys");

            migrationBuilder.DropIndex(
                name: "IX_Pedidos_MotoboyId",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "ScheduleJson",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "UseAutoSchedule",
                table: "StoreSettings");

            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "ImagemUrl",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "IsAtivo",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "MotoboyId",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "IsDisponivel",
                table: "Adicionais");
        }
    }
}
