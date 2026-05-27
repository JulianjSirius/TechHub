using System.Collections.Generic;
using System.Threading.Tasks;
using SkySync.Domain.Entidades;

namespace SkySync.Application.Interfaces
{
    public interface IVuelosService
    {
        Task<IEnumerable<Vuelo>> ObtenerVuelosAsync();
        Task<Vuelo?> ObtenerVueloPorIdAsync(int id);
        Task<Vuelo> CrearVueloAsync(Vuelo nuevoVuelo);
    }
}
