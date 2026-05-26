using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechHub.API.DateTransfer;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AeropuertosController : ControllerBase
    {
        private readonly IAeropuertosService _aeropuertosService;
        private readonly IPilotosService _pilotosService;
        private readonly TechHub.Infrastructure.TechHubDbContext _context;

        public AeropuertosController(IAeropuertosService aeropuertosService, IPilotosService pilotosService, TechHub.Infrastructure.TechHubDbContext context)
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

            var creado = await _aeropuertosService.CrearAeropuertoAsync(aeropuerto);
            return CreatedAtAction(nameof(GetAeropuerto), new { id = creado.Id }, creado);
        }

        [HttpPost("seed")]
        public async Task<ActionResult> SeedAeropuertos()
        {
            var existing = await _context.Aeropuertos.CountAsync();
            if (existing > 0)
                return Ok(new { mensaje = $"Ya existen {existing} aeropuertos. Seed no ejecutado." });

            var aeropuertos = new List<Aeropuerto>
            {
                new() { Nombre = "El Dorado", Ciudad = "Bogotá" },
                new() { Nombre = "José María Córdova", Ciudad = "Medellín" },
                new() { Nombre = "Alfonso Bonilla Aragón", Ciudad = "Cali" },
                new() { Nombre = "Rafael Núñez", Ciudad = "Cartagena" },
                new() { Nombre = "Ernesto Cortissoz", Ciudad = "Barranquilla" },
                new() { Nombre = "Palonegro", Ciudad = "Bucaramanga" },
                new() { Nombre = "Matecaña", Ciudad = "Pereira" },
                new() { Nombre = "Gustavo Rojas Pinilla", Ciudad = "San Andrés" },
                new() { Nombre = "Simón Bolívar", Ciudad = "Santa Marta" },
                new() { Nombre = "Guillermo León Valencia", Ciudad = "Popayán" }
            };

            _context.Aeropuertos.AddRange(aeropuertos);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = $"Creados {aeropuertos.Count} aeropuertos exitosamente." });
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
