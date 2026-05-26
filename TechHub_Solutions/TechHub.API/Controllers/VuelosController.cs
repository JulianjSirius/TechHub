using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TechHub.API.DateTransfer;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;

namespace TechHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VuelosController : ControllerBase
    {
        private readonly IVuelosService _vuelosService;
        private readonly IPilotosService _pilotosService;

        public VuelosController(IVuelosService vuelosService, IPilotosService pilotosService)
        {
            _vuelosService = vuelosService;
            _pilotosService = pilotosService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VueloDTO>>> GetVuelos()
        {
            var vuelos = await _vuelosService.ObtenerVuelosAsync();

            var vuelosDto = vuelos.Select(v => new VueloDTO
            {
                Id = v.Id,
                Origen = v.Origen,
                Destino = v.Destino,
                FechaSalida = v.FechaSalida,
                CuposMaximos = v.CuposMaximos,
                CuposDisponibles = v.CuposDisponibles
            }).ToList();

            return Ok(vuelosDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VueloDTO>> GetVuelo(int id)
        {
            var vuelo = await _vuelosService.ObtenerVueloPorIdAsync(id);

            if (vuelo == null)
            {
                return NotFound();
            }

            var dto = new VueloDTO
            {
                Id = vuelo.Id,
                Origen = vuelo.Origen,
                Destino = vuelo.Destino,
                FechaSalida = vuelo.FechaSalida,
                CuposMaximos = vuelo.CuposMaximos,
                CuposDisponibles = vuelo.CuposDisponibles
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<VueloDTO>> CrearVuelo([FromBody] VueloDTO vueloDto, [FromQuery] int pilotoId)
        {
            if (pilotoId <= 0)
            {
                return BadRequest("PilotoId es obligatorio.");
            }

            var piloto = await _pilotosService.ObtenerPilotoPorIdAsync(pilotoId);
            if (piloto == null)
            {
                return Unauthorized("Piloto no autorizado.");
            }

            if (vueloDto == null || string.IsNullOrWhiteSpace(vueloDto.Origen) || string.IsNullOrWhiteSpace(vueloDto.Destino))
            {
                return BadRequest("Origen y destino son obligatorios.");
            }

            if (vueloDto.FechaSalida == default)
            {
                return BadRequest("FechaSalida es obligatoria.");
            }

            if (vueloDto.CuposMaximos <= 0)
            {
                return BadRequest("CuposMaximos debe ser mayor que cero.");
            }

            var cuposDisponibles = vueloDto.CuposDisponibles > 0 ? vueloDto.CuposDisponibles : vueloDto.CuposMaximos;
            if (cuposDisponibles > vueloDto.CuposMaximos)
            {
                return BadRequest("CuposDisponibles no puede ser mayor que CuposMaximos.");
            }

            var nuevoVuelo = new Vuelo
            {
                Origen = vueloDto.Origen,
                Destino = vueloDto.Destino,
                FechaSalida = vueloDto.FechaSalida,
                CuposMaximos = vueloDto.CuposMaximos,
                CuposDisponibles = cuposDisponibles
            };

            var creado = await _vuelosService.CrearVueloAsync(nuevoVuelo);

            var dto = new VueloDTO
            {
                Id = creado.Id,
                Origen = creado.Origen,
                Destino = creado.Destino,
                FechaSalida = creado.FechaSalida,
                CuposMaximos = creado.CuposMaximos,
                CuposDisponibles = creado.CuposDisponibles
            };

            return CreatedAtAction(nameof(GetVuelo), new { id = dto.Id }, dto);
        }
    }
}
