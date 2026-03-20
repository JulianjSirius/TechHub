using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; 
using TechHub.BLL.Interfaces;
using TechHub.DAL;
using TechHub.DAL.Entidades;

namespace TechHub.BLL.Servicios
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