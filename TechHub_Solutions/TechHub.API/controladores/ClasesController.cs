using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechHub.API.DateTransfer;
using TechHub.BLL.Interfaces;
using TechHub.BLL.Servicios;
using TechHub.DAL;
using TechHub.DAL.Entidades;

namespace TechHub.API.controladores
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasesController : ControllerBase
    {
        private readonly TechHubDbContext _context;
        private readonly IAgendaService _agendaService;

        // Inyectamos ambos en el constructor IAgendaService agendaService
        public ClasesController(TechHubDbContext context, IAgendaService agendaService)
        {
            _context = context;
           _agendaService = agendaService;
        }

        // 1. GET: Obtenemos las clases pero las convertimos a DTO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClaseDTO>>> GetClases()
        {
            var clasesDB = await _context.Clases.ToListAsync();

            // Transformamos la entidad pesada en un DTO ligero
            var clasesDTO = clasesDB.Select(c => new ClaseDTO
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                CuposMaximos = (int)c.CuposMaximos,
                CuposDisponibles = (int)c.CuposDisponibles
            }).ToList();

            return Ok(clasesDTO);
        }

        // POST para que use la Capa BLL
        [HttpPost("agendar")]
        public async Task<ActionResult> AgendarClase([FromBody] NuevaReservaDTO reservaDto)
        {
            // Le pasamos la responsabilidad a la Capa Lógica (BLL)
            bool exito = await _agendaService.ReservarClaseAsync(reservaDto.UsuarioId, reservaDto.ClaseId);

            if (!exito)
            {
                return BadRequest(new { mensaje = "No se pudo agendar. Es posible que la clase ya no tenga cupos disponibles." });
            }

            return Ok(new { mensaje = "¡Clase agendada con éxito!" });
        }
    }
}