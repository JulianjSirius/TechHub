using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkySync.API.DateTransfer;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;

namespace SkySync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvionesController : ControllerBase
    {
        private readonly IAvionesService _avionesService;
        private readonly IPilotosService _pilotosService;

        public AvionesController(IAvionesService avionesService, IPilotosService pilotosService)
        {
            _avionesService = avionesService;
            _pilotosService = pilotosService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Avion>>> GetAviones()
        {
            var aviones = await _avionesService.ObtenerAvionesAsync();
            return Ok(aviones);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Avion>> GetAvion(int id)
        {
            var avion = await _avionesService.ObtenerAvionPorIdAsync(id);

            if (avion == null)
            {
                return NotFound();
            }

            return Ok(avion);
        }

        [HttpPost]
        public async Task<ActionResult<Avion>> CrearAvion([FromBody] Avion avion)
        {
            if (avion == null || string.IsNullOrWhiteSpace(avion.Modelo))
            {
                return BadRequest("Modelo es obligatorio.");
            }

            if (avion.Capacidad <= 0)
            {
                return BadRequest("Capacidad debe ser mayor que cero.");
            }

            var creado = await _avionesService.CrearAvionAsync(avion);
            return CreatedAtAction(nameof(GetAvion), new { id = creado.Id }, creado);
        }

        [HttpPut("{id}/capacidad")]
        public async Task<ActionResult<Avion>> ActualizarCapacidad(int id, [FromBody] ActualizarCapacidadAvionDTO capacidadDto, [FromQuery] int pilotoId)
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

            if (capacidadDto == null || capacidadDto.Capacidad <= 0)
            {
                return BadRequest("Capacidad debe ser mayor que cero.");
            }

            var avion = await _avionesService.ObtenerAvionPorIdAsync(id);
            if (avion == null)
            {
                return NotFound();
            }

            avion.Capacidad = capacidadDto.Capacidad;

            var actualizado = await _avionesService.ActualizarAvionAsync(avion);
            return Ok(actualizado);
        }
    }
}
