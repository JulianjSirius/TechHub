using System.Collections.Generic;
using System.Threading.Tasks;
using SkySync.Domain.Entidades;

namespace SkySync.Application.Interfaces
{
    public interface IAeropuertosService
    {
        Task<IEnumerable<Aeropuerto>> ObtenerAeropuertosAsync();
        Task<Aeropuerto?> ObtenerAeropuertoPorIdAsync(int id);
        Task<Aeropuerto> CrearAeropuertoAsync(Aeropuerto nuevoAeropuerto);
        Task<Aeropuerto?> ActualizarAeropuertoAsync(Aeropuerto aeropuerto);
    }
}
