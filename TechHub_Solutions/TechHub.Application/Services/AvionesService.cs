using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Application.Servicios
{
    public class AvionesService : IAvionesService
    {
        private readonly TechHubDbContext _context;

        public AvionesService(TechHubDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Avion>> ObtenerAvionesAsync()
        {
            return await _context.Aviones.ToListAsync();
        }

        public async Task<Avion?> ObtenerAvionPorIdAsync(int id)
        {
            return await _context.Aviones.FindAsync(id);
        }

        public async Task<Avion> CrearAvionAsync(Avion nuevoAvion)
        {
            _context.Aviones.Add(nuevoAvion);
            await _context.SaveChangesAsync();
            return nuevoAvion;
        }

        public async Task<Avion?> ActualizarAvionAsync(Avion avion)
        {
            _context.Aviones.Update(avion);
            await _context.SaveChangesAsync();
            return avion;
        }
    }
}
