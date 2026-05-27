using Microsoft.EntityFrameworkCore;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.Application.Servicios
{
    public class AgendaService : IAgendaService
    {
        private readonly SkySyncDbContext _context;

        public AgendaService(SkySyncDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Clase>> ObtenerClasesAsync()
        {
            return await _context.Clases.ToListAsync();
        }

        public async Task<bool> ReservarClaseAsync(int usuarioId, int claseId, int vueloId)
        {
            var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.Id == usuarioId);
            if (!usuarioExiste)
            {
                return false;
            }

            var clase = await _context.Clases.FindAsync(claseId);
            if (clase == null)
            {
                return false;
            }

            var vuelo = await _context.Vuelos.FindAsync(vueloId);
            if (vuelo == null || vuelo.CuposDisponibles <= 0)
            {
                return false;
            }

            var reservaExiste = await _context.Reservas.AnyAsync(r => r.UsuarioId == usuarioId && r.VueloId == vueloId);
            if (reservaExiste)
            {
                return false;
            }

            var nuevaReserva = new Reserva
            {
                UsuarioId = usuarioId,
                ClaseId = claseId,
                VueloId = vueloId,
                FechaReserva = DateTime.UtcNow
            };

            vuelo.CuposDisponibles -= 1;

            _context.Reservas.Add(nuevaReserva);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}