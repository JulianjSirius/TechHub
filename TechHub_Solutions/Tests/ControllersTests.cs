using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TechHub.API.Controllers;
using TechHub.API.DateTransfer;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using Xunit;

namespace TechHub.Tests;

public class ControllersTests
{
    [Fact]
    public async Task AeropuertosController_CrearAeropuerto_SinPilotoId_BadRequest()
    {
        var aeropuertosService = new FakeAeropuertosService();
        var pilotosService = new FakePilotosService();
        var controller = new AeropuertosController(aeropuertosService, pilotosService);

        var result = await controller.CrearAeropuerto(new Aeropuerto { Nombre = "A", Ciudad = "C" }, pilotoId: 0);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task AeropuertosController_CrearAeropuerto_PilotoNoExiste_Unauthorized()
    {
        var aeropuertosService = new FakeAeropuertosService();
        var pilotosService = new FakePilotosService();
        var controller = new AeropuertosController(aeropuertosService, pilotosService);

        var result = await controller.CrearAeropuerto(new Aeropuerto { Nombre = "A", Ciudad = "C" }, pilotoId: 1);

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }

    [Fact]
    public async Task AeropuertosController_ActualizarAeropuerto_OK()
    {
        var aeropuertosService = new FakeAeropuertosService();
        var pilotosService = new FakePilotosService(new Piloto { Id = 1, Nombre = "P1", Licencia = "L1" });
        var controller = new AeropuertosController(aeropuertosService, pilotosService);

        var creado = await aeropuertosService.CrearAeropuertoAsync(new Aeropuerto { Nombre = "A", Ciudad = "C" });

        var result = await controller.ActualizarAeropuerto(
            creado.Id,
            new ActualizarAeropuertoDTO { Nombre = "A2", Ciudad = "C2" },
            pilotoId: 1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var actualizado = Assert.IsType<Aeropuerto>(ok.Value);
        Assert.Equal("A2", actualizado.Nombre);
        Assert.Equal("C2", actualizado.Ciudad);
    }

    [Fact]
    public async Task AvionesController_ActualizarCapacidad_OK()
    {
        var avionesService = new FakeAvionesService();
        var pilotosService = new FakePilotosService(new Piloto { Id = 1, Nombre = "P1", Licencia = "L1" });
        var controller = new AvionesController(avionesService, pilotosService);

        var creado = await avionesService.CrearAvionAsync(new Avion { Modelo = "M1", Capacidad = 100 });

        var result = await controller.ActualizarCapacidad(
            creado.Id,
            new ActualizarCapacidadAvionDTO { Capacidad = 150 },
            pilotoId: 1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var actualizado = Assert.IsType<Avion>(ok.Value);
        Assert.Equal(150, actualizado.Capacidad);
    }

    [Fact]
    public async Task VuelosController_CrearVuelo_PilotoNoExiste_Unauthorized()
    {
        var vuelosService = new FakeVuelosService();
        var pilotosService = new FakePilotosService();
        var controller = new VuelosController(vuelosService, pilotosService);

        var result = await controller.CrearVuelo(
            new VueloDTO
            {
                Origen = "BOG",
                Destino = "MDE",
                FechaSalida = System.DateTime.UtcNow.AddDays(1),
                CuposMaximos = 10,
                CuposDisponibles = 10
            },
            pilotoId: 1);

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }

    [Fact]
    public async Task VuelosController_CrearVuelo_OK()
    {
        var vuelosService = new FakeVuelosService();
        var pilotosService = new FakePilotosService(new Piloto { Id = 1, Nombre = "P1", Licencia = "L1" });
        var controller = new VuelosController(vuelosService, pilotosService);

        var result = await controller.CrearVuelo(
            new VueloDTO
            {
                Origen = "BOG",
                Destino = "MDE",
                FechaSalida = System.DateTime.UtcNow.AddDays(1),
                CuposMaximos = 10,
                CuposDisponibles = 10
            },
            pilotoId: 1);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var dto = Assert.IsType<VueloDTO>(created.Value);
        Assert.Equal("BOG", dto.Origen);
        Assert.Equal("MDE", dto.Destino);
    }

    private sealed class FakePilotosService : IPilotosService
    {
        private readonly Dictionary<int, Piloto> _pilotos;

        public FakePilotosService(params Piloto[] pilotos)
        {
            _pilotos = pilotos.ToDictionary(p => p.Id, p => p);
        }

        public Task<IEnumerable<Piloto>> ObtenerPilotosAsync()
        {
            return Task.FromResult<IEnumerable<Piloto>>(_pilotos.Values.ToList());
        }

        public Task<Piloto?> ObtenerPilotoPorIdAsync(int id)
        {
            return Task.FromResult(_pilotos.TryGetValue(id, out var piloto) ? piloto : null);
        }

        public Task<Piloto> CrearPilotoAsync(Piloto nuevoPiloto)
        {
            if (nuevoPiloto.Id == 0)
            {
                nuevoPiloto.Id = _pilotos.Count + 1;
            }

            _pilotos[nuevoPiloto.Id] = nuevoPiloto;
            return Task.FromResult(nuevoPiloto);
        }
    }

    private sealed class FakeAeropuertosService : IAeropuertosService
    {
        private readonly Dictionary<int, Aeropuerto> _aeropuertos = new();
        private int _nextId = 1;

        public Task<IEnumerable<Aeropuerto>> ObtenerAeropuertosAsync()
        {
            return Task.FromResult<IEnumerable<Aeropuerto>>(_aeropuertos.Values.ToList());
        }

        public Task<Aeropuerto?> ObtenerAeropuertoPorIdAsync(int id)
        {
            return Task.FromResult(_aeropuertos.TryGetValue(id, out var aeropuerto) ? aeropuerto : null);
        }

        public Task<Aeropuerto> CrearAeropuertoAsync(Aeropuerto nuevoAeropuerto)
        {
            if (nuevoAeropuerto.Id == 0)
            {
                nuevoAeropuerto.Id = _nextId++;
            }

            _aeropuertos[nuevoAeropuerto.Id] = nuevoAeropuerto;
            return Task.FromResult(nuevoAeropuerto);
        }

        public Task<Aeropuerto?> ActualizarAeropuertoAsync(Aeropuerto aeropuerto)
        {
            _aeropuertos[aeropuerto.Id] = aeropuerto;
            return Task.FromResult<Aeropuerto?>(aeropuerto);
        }
    }

    private sealed class FakeAvionesService : IAvionesService
    {
        private readonly Dictionary<int, Avion> _aviones = new();
        private int _nextId = 1;

        public Task<IEnumerable<Avion>> ObtenerAvionesAsync()
        {
            return Task.FromResult<IEnumerable<Avion>>(_aviones.Values.ToList());
        }

        public Task<Avion?> ObtenerAvionPorIdAsync(int id)
        {
            return Task.FromResult(_aviones.TryGetValue(id, out var avion) ? avion : null);
        }

        public Task<Avion> CrearAvionAsync(Avion nuevoAvion)
        {
            if (nuevoAvion.Id == 0)
            {
                nuevoAvion.Id = _nextId++;
            }

            _aviones[nuevoAvion.Id] = nuevoAvion;
            return Task.FromResult(nuevoAvion);
        }

        public Task<Avion?> ActualizarAvionAsync(Avion avion)
        {
            _aviones[avion.Id] = avion;
            return Task.FromResult<Avion?>(avion);
        }
    }

    private sealed class FakeVuelosService : IVuelosService
    {
        private readonly Dictionary<int, Vuelo> _vuelos = new();
        private int _nextId = 1;

        public Task<IEnumerable<Vuelo>> ObtenerVuelosAsync()
        {
            return Task.FromResult<IEnumerable<Vuelo>>(_vuelos.Values.ToList());
        }

        public Task<Vuelo?> ObtenerVueloPorIdAsync(int id)
        {
            return Task.FromResult(_vuelos.TryGetValue(id, out var vuelo) ? vuelo : null);
        }

        public Task<Vuelo> CrearVueloAsync(Vuelo nuevoVuelo)
        {
            if (nuevoVuelo.Id == 0)
            {
                nuevoVuelo.Id = _nextId++;
            }

            _vuelos[nuevoVuelo.Id] = nuevoVuelo;
            return Task.FromResult(nuevoVuelo);
        }
    }
}
