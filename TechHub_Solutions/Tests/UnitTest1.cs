using Microsoft.EntityFrameworkCore;
using TechHub.Application.Servicios;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Tests;

public class UnitTest1
{
    private static TechHubDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<TechHubDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new TechHubDbContext(options);
    }

    [Fact]
    public async Task UsuariosService_RegistrarYValidarUsuario_OK()
    {
        await using var db = CreateInMemoryDbContext();
        var service = new UsuariosService(db);

        var nuevo = new Usuario
        {
            Nombre = "Ana",
            Correo = "ana@demo.com",
            Contrasena = "123"
        };

        var registrado = await service.RegistrarUsuarioAsync(nuevo);
        var validado = await service.ValidarUsuarioAsync("ana@demo.com", "123");

        Assert.NotNull(registrado);
        Assert.NotNull(validado);
        Assert.Equal("ana@demo.com", validado!.Correo);
    }

    [Fact]
    public async Task AgendaService_ReservarClase_DescuentaCupo()
    {
        await using var db = CreateInMemoryDbContext();
        db.Clases.Add(new Clase
        {
            Nombre = "Yoga",
            CuposMaximos = 2,
            CuposDisponibles = 1
        });
        await db.SaveChangesAsync();

        var service = new AgendaService(db);
        var claseId = db.Clases.Single().Id;
        var reservado = await service.ReservarClaseAsync(usuarioId: 1, claseId: claseId);

        var claseActualizada = await db.Clases.FindAsync(claseId);

        Assert.True(reservado);
        Assert.NotNull(claseActualizada);
        Assert.Equal(0, claseActualizada!.CuposDisponibles);
    }
}
