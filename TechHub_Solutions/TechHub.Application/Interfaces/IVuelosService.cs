using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IVuelosService
    {
        Task<IEnumerable<Vuelo>> ObtenerVuelosAsync();
        Task<Vuelo?> ObtenerVueloPorIdAsync(int id);
        Task<Vuelo> CrearVueloAsync(Vuelo nuevoVuelo);
    }
}
