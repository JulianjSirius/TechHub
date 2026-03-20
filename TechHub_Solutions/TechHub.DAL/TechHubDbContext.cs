using Microsoft.EntityFrameworkCore;
using TechHub.DAL.Entidades; 

namespace TechHub.DAL
{
    public class TechHubDbContext : DbContext
    {
        
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Clase> Clases { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
          
            optionsBuilder.UseNpgsql("Host=localhost;Database=TechHubDB;Username=postgres;Password=12345");
        }
        
    }
}