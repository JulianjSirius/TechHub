using Microsoft.EntityFrameworkCore;
using SkySync.Application.Servicios;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.Tests;

public class UnitTest1
{
    private static SkySyncDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<SkySyncDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new SkySyncDbContext(options);
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
        db.Usuarios.Add(new Usuario
        {
            Nombre = "Ana",
            Correo = "ana@demo.com",
            Contrasena = "123"
        });
        db.Clases.Add(new Clase
        {
            Nombre = "Yoga",
            CuposMaximos = 2,
            CuposDisponibles = 1
        });
        db.Vuelos.Add(new Vuelo
        {
            Origen = "BOG",
            Destino = "MDE",
            FechaSalida = DateTime.UtcNow.AddDays(1),
            CuposMaximos = 3,
            CuposDisponibles = 1
        });
        await db.SaveChangesAsync();

        var service = new AgendaService(db);
        var usuarioId = db.Usuarios.Single().Id;
        var claseId = db.Clases.Single().Id;
        var vueloId = db.Vuelos.Single().Id;
        var reservado = await service.ReservarClaseAsync(usuarioId: usuarioId, claseId: claseId, vueloId: vueloId);

        var claseActualizada = await db.Clases.FindAsync(claseId);
        var vueloActualizado = await db.Vuelos.FindAsync(vueloId);

        Assert.True(reservado);
        Assert.NotNull(claseActualizada);
        Assert.NotNull(vueloActualizado);
        Assert.Equal(0, vueloActualizado!.CuposDisponibles);
    }
}
