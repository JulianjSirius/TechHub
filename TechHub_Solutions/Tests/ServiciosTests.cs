using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Servicios;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;
using Xunit;

namespace TechHub.Tests;

public class ServiciosTests
{
    private static TechHubDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<TechHubDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new TechHubDbContext(options);
    }

    [Fact]
    public async Task AeropuertosService_CrearYObtenerPorId_OK()
    {
        await using var db = CreateInMemoryDbContext();
        var service = new AeropuertosService(db);

        var nuevo = new Aeropuerto
        {
            Nombre = "JFK",
            Ciudad = "New York"
        };

        var creado = await service.CrearAeropuertoAsync(nuevo);
        var encontrado = await service.ObtenerAeropuertoPorIdAsync(creado.Id);

        Assert.NotNull(encontrado);
        Assert.Equal("JFK", encontrado!.Nombre);
        Assert.Equal("New York", encontrado.Ciudad);
    }

    [Fact]
    public async Task AvionesService_CrearYListar_OK()
    {
        await using var db = CreateInMemoryDbContext();
        var service = new AvionesService(db);

        await service.CrearAvionAsync(new Avion { Modelo = "A320", Capacidad = 180 });
        await service.CrearAvionAsync(new Avion { Modelo = "B737", Capacidad = 160 });

        var aviones = (await service.ObtenerAvionesAsync()).ToList();

        Assert.Equal(2, aviones.Count);
        Assert.Contains(aviones, a => a.Modelo == "A320");
        Assert.Contains(aviones, a => a.Modelo == "B737");
    }

    [Fact]
    public async Task PilotosService_CrearYObtenerPorId_OK()
    {
        await using var db = CreateInMemoryDbContext();
        var service = new PilotosService(db);

        var creado = await service.CrearPilotoAsync(new Piloto { Nombre = "Luis", Licencia = "LIC-123" });
        var encontrado = await service.ObtenerPilotoPorIdAsync(creado.Id);

        Assert.NotNull(encontrado);
        Assert.Equal("Luis", encontrado!.Nombre);
        Assert.Equal("LIC-123", encontrado.Licencia);
    }

    [Fact]
    public async Task VuelosService_CrearYListar_OK()
    {
        await using var db = CreateInMemoryDbContext();
        var service = new VuelosService(db);

        await service.CrearVueloAsync(new Vuelo
        {
            Origen = "BOG",
            Destino = "MDE",
            FechaSalida = DateTime.UtcNow.AddDays(1),
            CuposMaximos = 3,
            CuposDisponibles = 3
        });

        var vuelos = (await service.ObtenerVuelosAsync()).ToList();

        Assert.Single(vuelos);
        Assert.Equal("BOG", vuelos[0].Origen);
        Assert.Equal("MDE", vuelos[0].Destino);
    }

    [Fact]
    public async Task UsuariosService_ObtenerPorCorreo_OK()
    {
        await using var db = CreateInMemoryDbContext();
        var service = new UsuariosService(db);

        await service.RegistrarUsuarioAsync(new Usuario
        {
            Nombre = "Carla",
            Correo = "carla@demo.com",
            Contrasena = "123"
        });

        var encontrado = await service.ObtenerUsuarioPorCorreoAsync("carla@demo.com");

        Assert.NotNull(encontrado);
        Assert.Equal("Carla", encontrado!.Nombre);
    }

    [Fact]
    public async Task UsuariosService_ActualizarUsuario_OK()
    {
        await using var db = CreateInMemoryDbContext();
        var service = new UsuariosService(db);

        var creado = await service.RegistrarUsuarioAsync(new Usuario
        {
            Nombre = "Mario",
            Correo = "mario@demo.com",
            Contrasena = "abc"
        });

        creado.Nombre = "Mario Gomez";
        creado.Direccion = "Calle 123";

        await service.ActualizarUsuarioAsync(creado);
        var actualizado = await service.ObtenerUsuarioPorIdAsync(creado.Id);

        Assert.NotNull(actualizado);
        Assert.Equal("Mario Gomez", actualizado!.Nombre);
        Assert.Equal("Calle 123", actualizado.Direccion);
    }

    [Fact]
    public async Task AgendaService_ReservarClase_SinCupos_RetornaFalse()
    {
        await using var db = CreateInMemoryDbContext();
        db.Usuarios.Add(new Usuario
        {
            Nombre = "Sofia",
            Correo = "sofia@demo.com",
            Contrasena = "123"
        });
        db.Clases.Add(new Clase
        {
            Nombre = "Pilates",
            CuposMaximos = 10,
            CuposDisponibles = 0
        });
        db.Vuelos.Add(new Vuelo
        {
            Origen = "BOG",
            Destino = "CTG",
            FechaSalida = DateTime.UtcNow.AddDays(2),
            CuposMaximos = 2,
            CuposDisponibles = 0
        });
        await db.SaveChangesAsync();

        var service = new AgendaService(db);
        var usuarioId = db.Usuarios.Single().Id;
        var claseId = db.Clases.Single().Id;
        var vueloId = db.Vuelos.Single().Id;

        var reservado = await service.ReservarClaseAsync(usuarioId: usuarioId, claseId: claseId, vueloId: vueloId);
        var vueloActualizado = await db.Vuelos.FindAsync(vueloId);

        Assert.False(reservado);
        Assert.NotNull(vueloActualizado);
        Assert.Equal(0, vueloActualizado!.CuposDisponibles);
        Assert.Equal(0, await db.Reservas.CountAsync());
    }

    [Fact]
    public async Task AgendaService_ReservarClase_SinUsuario_RetornaFalse()
    {
        await using var db = CreateInMemoryDbContext();
        db.Clases.Add(new Clase
        {
            Nombre = "Box",
            CuposMaximos = 5,
            CuposDisponibles = 1
        });
        db.Vuelos.Add(new Vuelo
        {
            Origen = "MDE",
            Destino = "CLO",
            FechaSalida = DateTime.UtcNow.AddDays(1),
            CuposMaximos = 3,
            CuposDisponibles = 2
        });
        await db.SaveChangesAsync();

        var service = new AgendaService(db);
        var claseId = db.Clases.Single().Id;
        var vueloId = db.Vuelos.Single().Id;

        var reservado = await service.ReservarClaseAsync(usuarioId: 999, claseId: claseId, vueloId: vueloId);
        var claseActualizada = await db.Clases.FindAsync(claseId);
        var vueloActualizado = await db.Vuelos.FindAsync(vueloId);

        Assert.False(reservado);
        Assert.NotNull(claseActualizada);
        Assert.NotNull(vueloActualizado);
        Assert.Equal(2, vueloActualizado!.CuposDisponibles);
        Assert.Equal(0, await db.Reservas.CountAsync());
    }

    [Fact]
    public async Task AgendaService_ReservarClase_Duplicada_RetornaFalse()
    {
        await using var db = CreateInMemoryDbContext();
        db.Usuarios.Add(new Usuario
        {
            Nombre = "Diego",
            Correo = "diego@demo.com",
            Contrasena = "123"
        });
        db.Clases.Add(new Clase
        {
            Nombre = "Spinning",
            CuposMaximos = 2,
            CuposDisponibles = 2
        });
        db.Vuelos.Add(new Vuelo
        {
            Origen = "PEI",
            Destino = "BOG",
            FechaSalida = DateTime.UtcNow.AddDays(3),
            CuposMaximos = 2,
            CuposDisponibles = 2
        });
        await db.SaveChangesAsync();

        var service = new AgendaService(db);
        var usuarioId = db.Usuarios.Single().Id;
        var claseId = db.Clases.Single().Id;
        var vueloId = db.Vuelos.Single().Id;

        var primera = await service.ReservarClaseAsync(usuarioId: usuarioId, claseId: claseId, vueloId: vueloId);
        var segunda = await service.ReservarClaseAsync(usuarioId: usuarioId, claseId: claseId, vueloId: vueloId);
        var claseActualizada = await db.Clases.FindAsync(claseId);
        var vueloActualizado = await db.Vuelos.FindAsync(vueloId);

        Assert.True(primera);
        Assert.False(segunda);
        Assert.NotNull(claseActualizada);
        Assert.NotNull(vueloActualizado);
        Assert.Equal(1, vueloActualizado!.CuposDisponibles);
        Assert.Equal(1, await db.Reservas.CountAsync());
    }

    [Fact]
    public async Task AgendaService_ReservarClase_ClaseInexistente_RetornaFalse()
    {
        await using var db = CreateInMemoryDbContext();
        db.Usuarios.Add(new Usuario
        {
            Nombre = "Luisa",
            Correo = "luisa@demo.com",
            Contrasena = "123"
        });
        db.Vuelos.Add(new Vuelo
        {
            Origen = "SMR",
            Destino = "BOG",
            FechaSalida = DateTime.UtcNow.AddDays(4),
            CuposMaximos = 5,
            CuposDisponibles = 5
        });
        await db.SaveChangesAsync();
        var service = new AgendaService(db);
        var usuarioId = db.Usuarios.Single().Id;
        var vueloId = db.Vuelos.Single().Id;

        var reservado = await service.ReservarClaseAsync(usuarioId: usuarioId, claseId: 999, vueloId: vueloId);
        var vueloActualizado = await db.Vuelos.FindAsync(vueloId);

        Assert.False(reservado);
        Assert.NotNull(vueloActualizado);
        Assert.Equal(5, vueloActualizado!.CuposDisponibles);
        Assert.Equal(0, await db.Reservas.CountAsync());
    }
}
