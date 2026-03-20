using System.Collections.Generic;
using System.Threading.Tasks;
using TechHub.DAL.Entidades;

namespace TechHub.BLL.Interfaces
{
    public interface IUsuariosService
    {
        Task<IEnumerable<Usuario>> ObtenerUsuariosAsync();
        Task<Usuario?> ObtenerUsuarioPorIdAsync(int id);
        Task<Usuario> RegistrarUsuarioAsync(Usuario NuevoUsuario);
        Task<Usuario?> ValidarUsuarioAsync(string correo, string Contrasena);
    }
}

