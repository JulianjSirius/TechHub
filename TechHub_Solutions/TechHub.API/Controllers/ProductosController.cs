using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;

namespace TechHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly IVentasService _ventasService;

        public ProductosController(IVentasService ventasService)
        {
            _ventasService = ventasService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var productos = await _ventasService.ObtenerProductosAsync();
            return Ok(productos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _ventasService.ObtenerProductoPorIdAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            return Ok(producto);
        }
    }
}