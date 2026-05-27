using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.Application.Servicios
{
    public class AeropuertosService : IAeropuertosService
    {
        private readonly SkySyncDbContext _context;

        public AeropuertosService(SkySyncDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Aeropuerto>> ObtenerAeropuertosAsync()
        {
            return await _context.Aeropuertos.ToListAsync();
        }

        public async Task<Aeropuerto?> ObtenerAeropuertoPorIdAsync(int id)
        {
            return await _context.Aeropuertos.FindAsync(id);
        }

        public async Task<Aeropuerto> CrearAeropuertoAsync(Aeropuerto nuevoAeropuerto)
        {
            _context.Aeropuertos.Add(nuevoAeropuerto);
            await _context.SaveChangesAsync();
            return nuevoAeropuerto;
        }

        public async Task<Aeropuerto?> ActualizarAeropuertoAsync(Aeropuerto aeropuerto)
        {
            _context.Aeropuertos.Update(aeropuerto);
            await _context.SaveChangesAsync();
            return aeropuerto;
        }
    }
}
