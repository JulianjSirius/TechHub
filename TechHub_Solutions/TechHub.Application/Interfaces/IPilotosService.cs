using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IPilotosService
    {
        Task<IEnumerable<Piloto>> ObtenerPilotosAsync();
        Task<Piloto?> ObtenerPilotoPorIdAsync(int id);
        Task<Piloto> CrearPilotoAsync(Piloto nuevoPiloto);
    }
}
