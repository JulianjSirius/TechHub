using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkySync.API.DateTransfer;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AeropuertosController : ControllerBase
    {
        private readonly IAeropuertosService _aeropuertosService;
        private readonly IPilotosService _pilotosService;
        private readonly SkySync.Infrastructure.SkySyncDbContext _context;

        public AeropuertosController(IAeropuertosService aeropuertosService, IPilotosService pilotosService, SkySync.Infrastructure.SkySyncDbContext context)
        {
            _aeropuertosService = aeropuertosService;
            _pilotosService = pilotosService;
            _context = context;
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

            // NUEVO: Asegurar que el aeropuerto nazca como Disponible
            aeropuerto.Estado = "Disponible";

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

        // ========================================================
        // NUEVO MÉTODO: Cambiar el estado del Aeropuerto
        // ========================================================
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromBody] string nuevoEstado)
        {
            var aeropuerto = await _aeropuertosService.ObtenerAeropuertoPorIdAsync(id);
            if (aeropuerto == null) return NotFound(new { mensaje = "Aeropuerto no encontrado" });

            // Validar que el estado sea uno de los permitidos
            if (nuevoEstado != "Disponible" && nuevoEstado != "Mantenimiento" && nuevoEstado != "Sin uso")
            {
                return BadRequest(new { mensaje = "Estado no válido. Use: Disponible, Mantenimiento o Sin uso." });
            }

            aeropuerto.Estado = nuevoEstado;

            // Usamos tu servicio existente para guardar los cambios en la BD
            await _aeropuertosService.ActualizarAeropuertoAsync(aeropuerto);

            return Ok(new { mensaje = $"Estado actualizado correctamente a {nuevoEstado}" });
        }
    }
}