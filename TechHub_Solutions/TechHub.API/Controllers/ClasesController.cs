using Microsoft.AspNetCore.Mvc;
using TechHub.API.DateTransfer;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;

namespace TechHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasesController : ControllerBase
    {
        private readonly IAgendaService _agendaService;

        public ClasesController(IAgendaService agendaService)
        {
            _agendaService = agendaService;
        }

        // 1. GET: Obtenemos las clases pero las convertimos a DTO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClaseDTO>>> GetClases()
        {
            var clasesDB = await _agendaService.ObtenerClasesAsync();

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
            if (reservaDto == null || reservaDto.UsuarioId <= 0 || reservaDto.ClaseId <= 0 || reservaDto.VueloId <= 0)
            {
                return BadRequest(new { mensaje = "Datos de reserva invalidos." });
            }

            // Le pasamos la responsabilidad a la Capa Logica (BLL)
            bool exito = await _agendaService.ReservarClaseAsync(reservaDto.UsuarioId, reservaDto.ClaseId, reservaDto.VueloId);

            if (!exito)
            {
                return BadRequest(new { mensaje = "No se pudo agendar. Es posible que la clase ya no tenga cupos disponibles." });
            }

            return Ok(new { mensaje = "¡Clase agendada con éxito!" });
        }
    }
}