using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IVentasService
    {
        Task<IEnumerable<Producto>> ObtenerProductosAsync();
        Task<Producto?> ObtenerProductoPorIdAsync(int id);
    }
}