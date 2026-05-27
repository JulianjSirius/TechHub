using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

using SkySync.API.DateTransfer;
using SkySync.Application.Interfaces;
using SkySync.Domain.Entidades;
using System.Linq;

namespace SkySync.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosService _usuariosService;
        private readonly IPilotosService _pilotosService;

        public UsuariosController(IUsuariosService usuariosService, IPilotosService pilotosService)
        {
            _usuariosService = usuariosService;
            _pilotosService = pilotosService;
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

            var nuevoUsuario = new Usuario
            {
                Nombre = registroRequest.Nombre,
                Correo = registroRequest.Correo,
                Contrasena = registroRequest.Contrasena,
                Rol = registroRequest.Rol,
                Licencia = registroRequest.Licencia
            };

            var usuarioRegistrado = await _usuariosService.RegistrarUsuarioAsync(nuevoUsuario);

            if (usuarioRegistrado.Rol == "Piloto" && !string.IsNullOrWhiteSpace(usuarioRegistrado.Licencia))
            {
                var pilotoExistente = await _pilotosService.ObtenerPilotosAsync();
                if (!pilotoExistente.Any(p => p.Licencia == usuarioRegistrado.Licencia))
                {
                    await _pilotosService.CrearPilotoAsync(new Piloto
                    {
                        Nombre = usuarioRegistrado.Nombre,
                        Licencia = usuarioRegistrado.Licencia
                    });
                }
            }

            return CreatedAtAction(nameof(GetUsuario), new { id = usuarioRegistrado.Id }, usuarioRegistrado);

        }

        [HttpPut("{id}/perfil")]
        public async Task<IActionResult> ActualizarPerfil(int id, [FromBody] ActualizarPerfilDTO perfilRequest)
        {
            if (perfilRequest == null || string.IsNullOrWhiteSpace(perfilRequest.Nombre))
            {
                return BadRequest("El nombre es obligatorio.");
            }

            var usuario = await _usuariosService.ObtenerUsuarioPorIdAsync(id);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            usuario.Nombre = perfilRequest.Nombre;
            usuario.Direccion = perfilRequest.Direccion;

            var actualizado = await _usuariosService.ActualizarUsuarioAsync(usuario);
            return Ok(actualizado);
        }

        [HttpPut("{id}/contrasena")]
        public async Task<IActionResult> CambiarContrasena(int id, [FromBody] ActualizarContrasenaDTO contrasenaRequest)
        {
            if (contrasenaRequest == null || string.IsNullOrWhiteSpace(contrasenaRequest.NuevaContrasena))
            {
                return BadRequest("La nueva contraseña es obligatoria.");
            }

            var usuario = await _usuariosService.ObtenerUsuarioPorIdAsync(id);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            if (usuario.Contrasena != contrasenaRequest.ContrasenaActual)
            {
                return BadRequest("La contraseña actual no es valida.");
            }

            usuario.Contrasena = contrasenaRequest.NuevaContrasena;
            await _usuariosService.ActualizarUsuarioAsync(usuario);

            return Ok(new { mensaje = "Contraseña actualizada correctamente." });
        }

        [HttpPost("recuperar")]
        public async Task<IActionResult> RecuperarContrasena([FromBody] RecuperarContrasenaDTO recuperarRequest)
        {
            if (recuperarRequest == null || string.IsNullOrWhiteSpace(recuperarRequest.Correo))
            {
                return BadRequest("El correo es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(recuperarRequest.NuevaContrasena))
            {
                return BadRequest("La nueva contraseña es obligatoria.");
            }

            var usuario = await _usuariosService.ObtenerUsuarioPorCorreoAsync(recuperarRequest.Correo);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            usuario.Contrasena = recuperarRequest.NuevaContrasena;
            await _usuariosService.ActualizarUsuarioAsync(usuario);

            return Ok(new { mensaje = "Contraseña restablecida correctamente." });
        }
    }
}