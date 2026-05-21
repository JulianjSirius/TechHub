using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IAgendaService
    {
        Task<IEnumerable<Clase>> ObtenerClasesAsync();


        Task<bool> ReservarClaseAsync(int usuarioId, int claseId);
    }
}