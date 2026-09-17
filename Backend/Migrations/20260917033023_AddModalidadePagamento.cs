using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkullShakes.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddModalidadePagamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ModalidadePagamento",
                table: "Pedidos",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModalidadePagamento",
                table: "Pedidos");
        }
    }
}
