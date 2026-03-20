using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.DAL.Entidades;

namespace TechHub.BLL.Interfaces
{
    public interface IVentasService
    {
        Task<IEnumerable<Producto>> ObtenerProductosAsync();
        Task<Producto?> ObtenerProductoPorIdAsync(int id);
    }
}