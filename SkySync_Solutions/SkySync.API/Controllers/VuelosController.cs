using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkySync.API.DateTransfer;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;

namespace SkySync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VuelosController : ControllerBase
    {
        private readonly IVuelosService _vuelosService;
        private const int CuposPorDefecto = 10;

        public VuelosController(IVuelosService vuelosService)
        {
            _vuelosService = vuelosService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VueloDTO>>> GetVuelos()
        {
            var vuelos = await _vuelosService.ObtenerVuelosAsync();

            var vuelosDto = vuelos.Select(v => new VueloDTO
            {
                Id = v.Id,
                Codigo = v.Codigo,
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
                Codigo = vuelo.Codigo,
                Origen = vuelo.Origen,
                Destino = vuelo.Destino,
                FechaSalida = vuelo.FechaSalida,
                CuposMaximos = vuelo.CuposMaximos,
                CuposDisponibles = vuelo.CuposDisponibles
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<VueloDTO>> CrearVuelo([FromBody] VueloDTO vueloDto)
        {
            if (vueloDto == null || string.IsNullOrWhiteSpace(vueloDto.Origen) || string.IsNullOrWhiteSpace(vueloDto.Destino))
            {
                return BadRequest("Origen y destino son obligatorios.");
            }

            if (vueloDto.FechaSalida == default)
            {
                return BadRequest("FechaSalida es obligatoria.");
            }

            var cuposMaximos = vueloDto.CuposMaximos > 0 ? vueloDto.CuposMaximos : CuposPorDefecto;
            var cuposDisponibles = vueloDto.CuposDisponibles > 0 ? vueloDto.CuposDisponibles : cuposMaximos;
            if (cuposDisponibles > cuposMaximos)
            {
                cuposDisponibles = cuposMaximos;
            }

            var nuevoVuelo = new Vuelo
            {
                Codigo = vueloDto.Codigo,
                Origen = vueloDto.Origen,
                Destino = vueloDto.Destino,
                FechaSalida = vueloDto.FechaSalida,
                CuposMaximos = cuposMaximos,
                CuposDisponibles = cuposDisponibles
            };

            var creado = await _vuelosService.CrearVueloAsync(nuevoVuelo);

            var dto = new VueloDTO
            {
                Id = creado.Id,
                Codigo = creado.Codigo,
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
