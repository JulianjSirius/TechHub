using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TechHub.API.DateTransfer;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;

namespace TechHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AeropuertosController : ControllerBase
    {
        private readonly IAeropuertosService _aeropuertosService;
        private readonly IPilotosService _pilotosService;

        public AeropuertosController(IAeropuertosService aeropuertosService, IPilotosService pilotosService)
        {
            _aeropuertosService = aeropuertosService;
            _pilotosService = pilotosService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aeropuerto>>> GetAeropuertos()
        {
            var aeropuertos = await _aeropuertosService.ObtenerAeropuertosAsync();
            return Ok(aeropuertos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Aeropuerto>> GetAeropuerto(int id)
        {
            var aeropuerto = await _aeropuertosService.ObtenerAeropuertoPorIdAsync(id);

            if (aeropuerto == null)
            {
                return NotFound();
            }

            return Ok(aeropuerto);
        }

        [HttpPost]
        public async Task<ActionResult<Aeropuerto>> CrearAeropuerto([FromBody] Aeropuerto aeropuerto, [FromQuery] int pilotoId)
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

            if (aeropuerto == null || string.IsNullOrWhiteSpace(aeropuerto.Nombre) || string.IsNullOrWhiteSpace(aeropuerto.Ciudad))
            {
                return BadRequest("Nombre y ciudad son obligatorios.");
            }

            var creado = await _aeropuertosService.CrearAeropuertoAsync(aeropuerto);
            return CreatedAtAction(nameof(GetAeropuerto), new { id = creado.Id }, creado);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Aeropuerto>> ActualizarAeropuerto(int id, [FromBody] ActualizarAeropuertoDTO aeropuertoDto, [FromQuery] int pilotoId)
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

            if (aeropuertoDto == null || string.IsNullOrWhiteSpace(aeropuertoDto.Nombre) || string.IsNullOrWhiteSpace(aeropuertoDto.Ciudad))
            {
                return BadRequest("Nombre y ciudad son obligatorios.");
            }

            var aeropuerto = await _aeropuertosService.ObtenerAeropuertoPorIdAsync(id);
            if (aeropuerto == null)
            {
                return NotFound();
            }

            aeropuerto.Nombre = aeropuertoDto.Nombre;
            aeropuerto.Ciudad = aeropuertoDto.Ciudad;

            var actualizado = await _aeropuertosService.ActualizarAeropuertoAsync(aeropuerto);
            return Ok(actualizado);
        }
    }
}
