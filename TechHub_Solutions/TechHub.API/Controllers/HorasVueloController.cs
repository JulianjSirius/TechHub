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
    [Route("api/horas-vuelo")]
    public class HorasVueloController : ControllerBase
    {
        private readonly IHorasVueloService _horasVueloService;

        public HorasVueloController(IHorasVueloService horasVueloService)
        {
            _horasVueloService = horasVueloService;
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<HorasVueloDTO>>> GetPorUsuario(int usuarioId)
        {
            var horas = await _horasVueloService.ObtenerPorUsuarioAsync(usuarioId);
            var dtos = horas.Select(h => new HorasVueloDTO
            {
                Id = h.Id,
                UsuarioId = h.UsuarioId,
                Fecha = h.Fecha,
                Horas = h.Horas,
                TipoVuelo = h.TipoVuelo,
                Origen = h.Origen,
                Destino = h.Destino,
                Notas = h.Notas
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HorasVueloDTO>>> GetTodas()
        {
            var horas = await _horasVueloService.ObtenerTodasAsync();
            var dtos = horas.Select(h => new HorasVueloDTO
            {
                Id = h.Id,
                UsuarioId = h.UsuarioId,
                Fecha = h.Fecha,
                Horas = h.Horas,
                TipoVuelo = h.TipoVuelo,
                Origen = h.Origen,
                Destino = h.Destino,
                Notas = h.Notas
            }).ToList();
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<HorasVueloDTO>> Crear([FromBody] HorasVueloDTO dto)
        {
            if (dto == null || dto.UsuarioId <= 0)
                return BadRequest("UsuarioId es obligatorio.");

            var horasVuelo = new HorasVuelo
            {
                UsuarioId = dto.UsuarioId,
                Fecha = dto.Fecha == default ? DateTime.UtcNow : dto.Fecha,
                Horas = dto.Horas,
                TipoVuelo = dto.TipoVuelo,
                Origen = dto.Origen,
                Destino = dto.Destino,
                Notas = dto.Notas
            };

            var creado = await _horasVueloService.CrearAsync(horasVuelo);
            dto.Id = creado.Id;
            return CreatedAtAction(nameof(GetPorUsuario), new { usuarioId = creado.UsuarioId }, dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _horasVueloService.EliminarAsync(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }
    }
}
