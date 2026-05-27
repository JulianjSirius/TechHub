using System.Collections.Generic;
using System.Threading.Tasks;
using SkySync.Domain.Entidades;

namespace SkySync.Application.Interfaces
{
    public interface IAgendaService
    {
        Task<IEnumerable<Clase>> ObtenerClasesAsync();


        Task<bool> ReservarClaseAsync(int usuarioId, int claseId, int vueloId);
    }
}