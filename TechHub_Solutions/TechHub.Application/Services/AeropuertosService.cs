using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Application.Servicios
{
    public class AeropuertosService : IAeropuertosService
    {
        private readonly TechHubDbContext _context;

        public AeropuertosService(TechHubDbContext context)
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
