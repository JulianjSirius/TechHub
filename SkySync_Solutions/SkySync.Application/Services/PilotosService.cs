using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.Application.Servicios
{
    public class PilotosService : IPilotosService
    {
        private readonly SkySyncDbContext _context;

        public PilotosService(SkySyncDbContext context)
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
