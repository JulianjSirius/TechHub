using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IAvionesService
    {
        Task<IEnumerable<Avion>> ObtenerAvionesAsync();
        Task<Avion?> ObtenerAvionPorIdAsync(int id);
        Task<Avion> CrearAvionAsync(Avion nuevoAvion);
        Task<Avion?> ActualizarAvionAsync(Avion avion);
    }
}
