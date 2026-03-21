using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.DAL.Entidades;

namespace TechHub.BLL.Interfaces
{
    public interface IAgendaService
    {
        Task<IEnumerable<Clase>> ObtenerClasesAsync();

     
        Task<bool> ReservarClaseAsync(int usuarioId, int claseId);
    }
}