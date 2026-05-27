using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using SkySync.Infrastructure;

namespace SkySync.Application.Servicios
{
    public class PracticasService : IPracticasService
    {
        private readonly SkySyncDbContext _context;

        public PracticasService(SkySyncDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Practica>> ObtenerPorUsuarioAsync(int usuarioId)
        {
            return await _context.Practicas
                .Where(p => p.UsuarioId == usuarioId)
                .OrderByDescending(p => p.Fecha)
                .ToListAsync();
        }

        public async Task<Practica> CrearAsync(Practica practica)
        {
            _context.Practicas.Add(practica);
            await _context.SaveChangesAsync();
            return practica;
        }

        public async Task<Practica?> ActualizarAsync(Practica practica)
        {
            _context.Practicas.Update(practica);
            await _context.SaveChangesAsync();
            return practica;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var practica = await _context.Practicas.FindAsync(id);
            if (practica == null) return false;
            _context.Practicas.Remove(practica);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
