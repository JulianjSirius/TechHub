using System.Collections.Generic;
using System.Threading.Tasks;
using SkySync.Domain.Entidades;

namespace SkySync.Application.Interfaces
{
    public interface IAvionesService
    {
        Task<IEnumerable<Avion>> ObtenerAvionesAsync();
        Task<Avion?> ObtenerAvionPorIdAsync(int id);
        Task<Avion> CrearAvionAsync(Avion nuevoAvion);
        Task<Avion?> ActualizarAvionAsync(Avion avion);
    }
}
