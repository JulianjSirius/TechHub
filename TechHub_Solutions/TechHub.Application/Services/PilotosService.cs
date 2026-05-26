using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Application.Servicios
{
    public class PilotosService : IPilotosService
    {
        private readonly TechHubDbContext _context;

        public PilotosService(TechHubDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Piloto>> ObtenerPilotosAsync()
        {
            return await _context.Pilotos.ToListAsync();
        }

        public async Task<Piloto?> ObtenerPilotoPorIdAsync(int id)
        {
            return await _context.Pilotos.FindAsync(id);
        }

        public async Task<Piloto> CrearPilotoAsync(Piloto nuevoPiloto)
        {
            _context.Pilotos.Add(nuevoPiloto);
            await _context.SaveChangesAsync();
            return nuevoPiloto;
        }
    }
}
