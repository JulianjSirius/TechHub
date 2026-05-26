using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Application.Servicios
{
    public class VuelosService : IVuelosService
    {
        private readonly TechHubDbContext _context;

        public VuelosService(TechHubDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vuelo>> ObtenerVuelosAsync()
        {
            return await _context.Vuelos.ToListAsync();
        }

        public async Task<Vuelo?> ObtenerVueloPorIdAsync(int id)
        {
            return await _context.Vuelos.FindAsync(id);
        }

        public async Task<Vuelo> CrearVueloAsync(Vuelo nuevoVuelo)
        {
            _context.Vuelos.Add(nuevoVuelo);
            await _context.SaveChangesAsync();
            return nuevoVuelo;
        }
    }
}
