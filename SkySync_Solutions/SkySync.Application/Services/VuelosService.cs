using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.Application.Servicios
{
    public class VuelosService : IVuelosService
    {
        private readonly SkySyncDbContext _context;

        public VuelosService(SkySyncDbContext context)
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
            if (string.IsNullOrWhiteSpace(nuevoVuelo.Codigo))
            {
                nuevoVuelo.Codigo = $"VUE-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..24].ToUpperInvariant();
            }

            _context.Vuelos.Add(nuevoVuelo);
            await _context.SaveChangesAsync();
            return nuevoVuelo;
        }
    }
}
