using System.Collections.Generic;
using System.Threading.Tasks;
using SkySync.Domain.Entidades;

namespace SkySync.Application.Interfaces
{
    public interface IHorasVueloService
    {
        Task<IEnumerable<HorasVuelo>> ObtenerPorUsuarioAsync(int usuarioId);
        Task<IEnumerable<HorasVuelo>> ObtenerTodasAsync();
        Task<HorasVuelo> CrearAsync(HorasVuelo horasVuelo);
        Task<bool> EliminarAsync(int id);
    }
}
