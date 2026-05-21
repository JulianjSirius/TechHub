using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechHub.Application.Interfaces;
using TechHub.Domain.Entidades;
using TechHub.Infrastructure;

namespace TechHub.Application.Servicios
{
    public class UsuariosService : IUsuariosService
    {
        private readonly TechHubDbContext _context;

        public UsuariosService(TechHubDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Usuario>> ObtenerUsuariosAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }
        public async Task<Usuario?> ObtenerUsuarioPorIdAsync(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        public async Task<Usuario?> ObtenerUsuarioPorCorreoAsync(string correo)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Correo == correo);
        }
        public async Task<Usuario> RegistrarUsuarioAsync(Usuario NuevoUsuario)
        {
            _context.Usuarios.Add(NuevoUsuario);
            await _context.SaveChangesAsync();
            return NuevoUsuario;
        }

        public async Task<Usuario?> ValidarUsuarioAsync(string correo, string Contrasena)
        {

            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == correo && u.Contrasena == Contrasena);
        }

        public async Task<Usuario?> ActualizarUsuarioAsync(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }
    }
}
