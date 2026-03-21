using Microsoft.EntityFrameworkCore;
using TechHub.BLL.Interfaces;
using TechHub.DAL;
using TechHub.DAL.Entidades;

namespace TechHub.BLL.Servicios
{
    public class AgendaService : IAgendaService
    {
        private readonly TechHubDbContext _context;

        public AgendaService(TechHubDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Clase>> ObtenerClasesAsync()
        {
            return await _context.Clases.ToListAsync();
        }

        public async Task<bool> ReservarClaseAsync(int usuarioId, int claseId)
        {
            // Busca la clase en la DB
            var clase = await _context.Clases.FindAsync(claseId);
            
            // Validación: ¿Existe la clase y tiene cupos?
            if (clase == null || clase.CuposDisponibles <= 0)
            {
                return false; 
            }

            // Crear la entidad de reserva
            var nuevaReserva = new Reserva
            {
                UsuarioId = usuarioId,
                ClaseId = claseId,
                FechaReserva = DateTime.UtcNow
            };

            //  Restar un cupo disponible
            clase.CuposDisponibles -= 1;

            // Guardamos todo en una sola transacción
            _context.Reservas.Add(nuevaReserva);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}