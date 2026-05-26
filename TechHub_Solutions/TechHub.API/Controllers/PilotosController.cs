using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TechHub.API.DateTransfer;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;

namespace TechHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PilotosController : ControllerBase
    {
        private readonly IPilotosService _pilotosService;

        public PilotosController(IPilotosService pilotosService)
        {
            _pilotosService = pilotosService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PilotoDTO>>> GetPilotos()
        {
            var pilotos = await _pilotosService.ObtenerPilotosAsync();

            var pilotosDto = pilotos.Select(p => new PilotoDTO
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Licencia = p.Licencia
            }).ToList();

            return Ok(pilotosDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PilotoDTO>> GetPiloto(int id)
        {
            var piloto = await _pilotosService.ObtenerPilotoPorIdAsync(id);

            if (piloto == null)
            {
                return NotFound();
            }

            var dto = new PilotoDTO
            {
                Id = piloto.Id,
                Nombre = piloto.Nombre,
                Licencia = piloto.Licencia
            };

            return Ok(dto);
        }

        [HttpPost]
        public ActionResult<PilotoDTO> CrearPiloto([FromBody] PilotoDTO pilotoDto)
        {
            return StatusCode(403, "La creacion de pilotos no esta permitida para clientes.");
        }
    }
}
