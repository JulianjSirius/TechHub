using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRolLicenciaToUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Rol",
                table: "Usuarios",
                type: "text",
                nullable: false,
                defaultValue: "Pasajero");

            migrationBuilder.AddColumn<string>(
                name: "Licencia",
                table: "Usuarios",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Rol", table: "Usuarios");
            migrationBuilder.DropColumn(name: "Licencia", table: "Usuarios");
        }
    }
}
