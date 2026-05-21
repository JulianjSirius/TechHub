using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Application.Servicios
{
    public class VentasService : IVentasService
    {
        private readonly TechHubDbContext _context;

        public VentasService(TechHubDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Producto>> ObtenerProductosAsync()
        {

            return await _context.Productos.ToListAsync();
        }


        public async Task<Producto?> ObtenerProductoPorIdAsync(int id)
        {

            return await _context.Productos.FindAsync(id);
        }
    }
}