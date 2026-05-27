using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkySync.API.DateTransfer;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly SkySyncDbContext _context;

        public ReservasController(SkySyncDbContext context)
        {
            _context = context;
        }

        // POST: api/reservas (El Pasajero agenda un vuelo)
        [HttpPost]
        public async Task<IActionResult> AgendarVuelo([FromBody] NuevaReservaDTO dto)
        {
            var reserva = new Reserva
            {
                UsuarioId = dto.UsuarioId,
                VueloId = dto.VueloId,
                ClaseId = dto.ClaseId > 0 ? dto.ClaseId : 1,
                Estado = "En proceso", // <-- Nace siempre en proceso
                FechaReserva = DateTime.UtcNow
            };

            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Vuelo agendado correctamente", reservaId = reserva.Id });
        }

        // GET: api/reservas/usuario/{usuarioId} (Listar los vuelos que agendó el pasajero)
        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> ObtenerMisReservas(int usuarioId)
        {
            var reservas = await _context.Reservas
                .Where(r => r.UsuarioId == usuarioId)
                .Select(r => new {
                    r.Id,
                    r.VueloId,
                    r.Estado,
                    r.FechaReserva
                }).ToListAsync();

            return Ok(reservas);
        }

        // PUT: api/reservas/{id}/estado (Cambiar de En Proceso a Completado)
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] string nuevoEstado)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return NotFound("Reserva no encontrada.");

            reserva.Estado = nuevoEstado; // Asignará "Completado"
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Estado actualizado a " + nuevoEstado });
        }
    }
}