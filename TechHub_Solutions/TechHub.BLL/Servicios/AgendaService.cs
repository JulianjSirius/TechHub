using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.BLL.Interfaces;
using TechHub.DAL;
using TechHub.DAL.Entidades;

namespace TechHub.BLL.Servicios
{
    public class AgendaService : IAgendaService
    {
        private readonly TechHubDbContext _context;

        public AgendaService(TechHubDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Clase>> ObtenerClasesAsync()
        {
            return await _context.Clases.ToListAsync();
        }

        public async Task<Clase?> ObtenerClasePorIdAsync(int id)
        {
            return await _context.Clases.FindAsync(id);
        }
    }
}