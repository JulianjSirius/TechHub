using Microsoft.AspNetCore.Mvc;
using TechHub.API.DateTransfer;
using TechHub.DAL;
using TechHub.DAL.Entidades;

[ApiController]
[Route("api/[controller]")]
public class MantenimientosController : ControllerBase
{
    private readonly TechHubDbContext _db;
    public MantenimientosController(TechHubDbContext db) => _db = db;

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] MantenimientoDTO dto)
    {
        // 1. Validar que el usuario existe
        var usuario = await _db.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario == null) return NotFound("Usuario no encontrado");

        // 2. Crear la entidad real desde el DTO
        var nuevoMantenimiento = new Mantenimiento
        {
            UsuarioId = dto.UsuarioId,
            ProductoId = dto.ProductoId,
            Fecha = dto.Fecha,
            Tipo = dto.Tipo,
            Notas = dto.Notas,
            Estado = "Pendiente" // Valor inicial por defecto
        };

        _db.Mantenimientos.Add(nuevoMantenimiento);
        await _db.SaveChangesAsync();

        return Ok(new { mensaje = "Cita de servicio técnico agendada", id = nuevoMantenimiento.Id });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Obtener(int id)
    {
        var mant = await _db.Mantenimientos.FindAsync(id);
        if (mant == null) return NotFound();
        return Ok(mant);
    }
}