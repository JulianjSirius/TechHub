using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.Domain.Entidades;

namespace TechHub.Application.Interfaces
{
    public interface IUsuariosService
    {
        Task<IEnumerable<Usuario>> ObtenerUsuariosAsync();
        Task<Usuario?> ObtenerUsuarioPorIdAsync(int id);
        Task<Usuario?> ObtenerUsuarioPorCorreoAsync(string correo);
        Task<Usuario> RegistrarUsuarioAsync(Usuario NuevoUsuario);
        Task<Usuario?> ValidarUsuarioAsync(string correo, string Contrasena);
        Task<Usuario?> ActualizarUsuarioAsync(Usuario usuario);
    }
}

