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
    public class PracticasController : ControllerBase
    {
        private readonly IPracticasService _practicasService;

        public PracticasController(IPracticasService practicasService)
        {
            _practicasService = practicasService;
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<PracticaDTO>>> GetPorUsuario(int usuarioId)
        {
            var practicas = await _practicasService.ObtenerPorUsuarioAsync(usuarioId);
            var dtos = practicas.Select(p => new PracticaDTO
            {
                Id = p.Id, UsuarioId = p.UsuarioId, Fecha = p.Fecha,
                Tipo = p.Tipo, Horas = p.Horas, Descripcion = p.Descripcion,
                Instructor = p.Instructor, Completada = p.Completada
            }).ToList();
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<PracticaDTO>> Crear([FromBody] PracticaDTO dto)
        {
            if (dto == null || dto.UsuarioId <= 0)
                return BadRequest("UsuarioId es obligatorio.");

            var practica = new Practica
            {
                UsuarioId = dto.UsuarioId,
                Fecha = dto.Fecha == default ? DateTime.UtcNow : dto.Fecha,
                Tipo = dto.Tipo,
                Horas = dto.Horas,
                Descripcion = dto.Descripcion,
                Instructor = dto.Instructor,
                Completada = dto.Completada
            };

            var creada = await _practicasService.CrearAsync(practica);
            return CreatedAtAction(nameof(GetPorUsuario), new { usuarioId = creada.UsuarioId }, creada);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] PracticaDTO dto)
        {
            if (dto == null) return BadRequest();

            var practica = new Practica
            {
                Id = id,
                UsuarioId = dto.UsuarioId,
                Fecha = dto.Fecha,
                Tipo = dto.Tipo,
                Horas = dto.Horas,
                Descripcion = dto.Descripcion,
                Instructor = dto.Instructor,
                Completada = dto.Completada
            };

            var resultado = await _practicasService.ActualizarAsync(practica);
            if (resultado == null) return NotFound();
            return Ok(resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _practicasService.EliminarAsync(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }
    }
}
