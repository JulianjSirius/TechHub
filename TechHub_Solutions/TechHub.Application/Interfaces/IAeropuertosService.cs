using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IAeropuertosService
    {
        Task<IEnumerable<Aeropuerto>> ObtenerAeropuertosAsync();
        Task<Aeropuerto?> ObtenerAeropuertoPorIdAsync(int id);
        Task<Aeropuerto> CrearAeropuertoAsync(Aeropuerto nuevoAeropuerto);
        Task<Aeropuerto?> ActualizarAeropuertoAsync(Aeropuerto aeropuerto);
    }
}
