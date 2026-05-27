using System.Collections.Generic;
using System.Threading.Tasks;
using SkySync.Domain.Entidades;

namespace SkySync.Application.Interfaces
{
    public interface IPracticasService
    {
        Task<IEnumerable<Practica>> ObtenerPorUsuarioAsync(int usuarioId);
        Task<Practica> CrearAsync(Practica practica);
        Task<Practica?> ActualizarAsync(Practica practica);
        Task<bool> EliminarAsync(int id);
    }
}
