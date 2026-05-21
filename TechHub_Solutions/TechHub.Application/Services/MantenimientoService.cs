using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Application.Servicios
{
    public class MantenimientoService : IMantenimientoService
    {
        private readonly TechHubDbContext _context;

        public MantenimientoService(TechHubDbContext context)
        {
            _context = context;
        }

        public async Task<ResultadoMantenimiento> CrearMantenimientoAsync(int usuarioId, int? productoId, DateTime fecha, string tipo, string? notas)
        {
            var usuarioExiste = await _context.Usuarios.AnyAsync(x => x.Id == usuarioId);
            if (!usuarioExiste)
            {
                return new ResultadoMantenimiento
                {
                    Exito = false,
                    Mensaje = "Usuario no encontrado"
                };
            }

            var nuevoMantenimiento = new Mantenimiento
            {
                UsuarioId = usuarioId,
                ProductoId = productoId,
                Fecha = fecha,
                Tipo = tipo,
                Notas = notas,
                Estado = "Pendiente"
            };

            _context.Mantenimientos.Add(nuevoMantenimiento);
            await _context.SaveChangesAsync();

            return new ResultadoMantenimiento
            {
                Exito = true,
                Mensaje = "Cita de servicio técnico agendada",
                MantenimientoId = nuevoMantenimiento.Id
            };
        }

        public async Task<Mantenimiento?> ObtenerMantenimientoAsync(int id)
        {
            return await _context.Mantenimientos.FindAsync(id);
        }
    }
}
