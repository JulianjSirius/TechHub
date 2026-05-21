using System;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IMantenimientoService
    {
        Task<ResultadoMantenimiento> CrearMantenimientoAsync(int usuarioId, int? productoId, DateTime fecha, string tipo, string? notas);
        Task<Mantenimiento?> ObtenerMantenimientoAsync(int id);
    }

    public sealed class ResultadoMantenimiento
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public int? MantenimientoId { get; set; }
    }
}
