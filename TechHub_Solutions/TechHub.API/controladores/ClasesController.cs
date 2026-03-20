using Microsoft.AspNetCore.Mvc;
using TechHub.BLL.Interfaces;
using TechHub.DAL.Entidades;

namespace TechHub.API.Controladores
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClasesController : ControllerBase
    {
        private readonly IAgendaService _agendaService;
        public ClasesController(IAgendaService agendaService)
        {
            _agendaService = agendaService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Clase>>> GetClases()
        {
            var clases = await _agendaService.ObtenerClasesAsync();
            return Ok(clases);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Clase>> GetClase(int id)
        {
            var clase = await _agendaService.ObtenerClasePorIdAsync(id);
            if (clase == null)
            {
                return NotFound();
            }
            return Ok(clase);
        }
    }
}
