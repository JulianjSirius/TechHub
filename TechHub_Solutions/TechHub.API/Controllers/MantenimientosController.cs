using Microsoft.AspNetCore.Mvc;
using TechHub.API.DateTransfer;
using TechHub.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class MantenimientosController : ControllerBase
{
    private readonly IMantenimientoService _mantenimientoService;

    public MantenimientosController(IMantenimientoService mantenimientoService)
    {
        _mantenimientoService = mantenimientoService;
    }

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] MantenimientoDTO dto)
    {
        var resultado = await _mantenimientoService.CrearMantenimientoAsync(
            dto.UsuarioId,
            dto.ProductoId,
            dto.Fecha,
            dto.Tipo,
            dto.Notas);
        if (!resultado.Exito)
        {
            return NotFound(resultado.Mensaje);
        }

        return Ok(new { mensaje = resultado.Mensaje, id = resultado.MantenimientoId });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Obtener(int id)
    {
        var mant = await _mantenimientoService.ObtenerMantenimientoAsync(id);
        if (mant == null) return NotFound();
        return Ok(mant);
    }
}