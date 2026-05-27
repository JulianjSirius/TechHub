using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.Application.Servicios
{
    public class HorasVueloService : IHorasVueloService
    {
        private readonly SkySyncDbContext _context;

        public HorasVueloService(SkySyncDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HorasVuelo>> ObtenerPorUsuarioAsync(int usuarioId)
        {
            return await _context.HorasVuelos
                .Where(h => h.UsuarioId == usuarioId)
                .OrderByDescending(h => h.Fecha)
                .ToListAsync();
        }

        public async Task<IEnumerable<HorasVuelo>> ObtenerTodasAsync()
        {
            return await _context.HorasVuelos
                .OrderByDescending(h => h.Fecha)
                .ToListAsync();
        }

        public async Task<HorasVuelo> CrearAsync(HorasVuelo horasVuelo)
        {
            _context.HorasVuelos.Add(horasVuelo);
            await _context.SaveChangesAsync();
            return horasVuelo;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var horasVuelo = await _context.HorasVuelos.FindAsync(id);
            if (horasVuelo == null) return false;
            _context.HorasVuelos.Remove(horasVuelo);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
