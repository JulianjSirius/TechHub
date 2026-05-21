using Microsoft.EntityFrameworkCore;
using TechHub.Domain.Entidades;

namespace TechHub.Infrastructure
{
    public class TechHubDbContext : DbContext
    {
        public TechHubDbContext(DbContextOptions<TechHubDbContext> options) : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Mantenimiento> Mantenimientos { get; set; }

    }
}