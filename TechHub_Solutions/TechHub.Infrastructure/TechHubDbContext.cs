using Microsoft.EntityFrameworkCore;
using TechHub.Domain.Entidades;

namespace TechHub.Infrastructure
{
    public class TechHubDbContext : DbContext
    {
        public TechHubDbContext(DbContextOptions<TechHubDbContext> options) : base(options) { }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<Piloto> Pilotos { get; set; }
        public DbSet<Avion> Aviones { get; set; }
        public DbSet<Vuelo> Vuelos { get; set; }
        public DbSet<Aeropuerto> Aeropuertos { get; set; }

    }
}