using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.BLL.Interfaces;
using TechHub.DAL.Entidades;
using TechHub.API.DateTransfer;

namespace TechHub.API.Controladores
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosService _usuariosService;

        public UsuariosController(IUsuariosService usuariosService)
        {
            _usuariosService = usuariosService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            var usuarios = await _usuariosService.ObtenerUsuariosAsync();
            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _usuariosService.ObtenerUsuarioPorIdAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDTO loginRequest)
        {
             if (loginRequest == null || string.IsNullOrWhiteSpace(loginRequest.Correo) || string.IsNullOrWhiteSpace(loginRequest.Contrasena))
            {
                return BadRequest("El correo y la contraseña son obligatorios.");
            }
            var usuario = await _usuariosService.ValidarUsuarioAsync(loginRequest.Correo, loginRequest.Contrasena);
            if (usuario == null)
            {
                return Unauthorized("correo o contraseña incorrectos");
            }
            return Ok(usuario);
        }
        [HttpPost("registro")]
        public async Task<IActionResult> RegistrarUsuario([FromBody] RegistroDTO registroRequest)
        {
            // Validar que la petición no venga vacía
            if (registroRequest == null)
            {
                return BadRequest("Datos de registro inválidos.");
            }

            // Validar en el backend que las contraseñas sean idénticas
            if (registroRequest.Contrasena != registroRequest.ConfirmarContrasena)
            {
                return BadRequest("Las contraseñas no coinciden.");
            }

            // (convertir) el DTO a la entidad real de tu base de datos
            var nuevoUsuario = new Usuario
            {
                Nombre = registroRequest.Nombre,
                Correo = registroRequest.Correo,
                Contrasena = registroRequest.Contrasena
            };

            var usuarioRegistrado = await _usuariosService.RegistrarUsuarioAsync(nuevoUsuario);
            return CreatedAtAction(nameof(GetUsuario), new { id = usuarioRegistrado.Id }, usuarioRegistrado);

        }
    }
}