using Microsoft.EntityFrameworkCore;
using SkySync.Domain.Entidades;

namespace SkySync.Infrastructure
{
    public class SkySyncDbContext : DbContext
    {
        public SkySyncDbContext(DbContextOptions<SkySyncDbContext> options) : base(options) { }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<Piloto> Pilotos { get; set; }
        public DbSet<Avion> Aviones { get; set; }
        public DbSet<Vuelo> Vuelos { get; set; }
        public DbSet<Aeropuerto> Aeropuertos { get; set; }
        public DbSet<Practica> Practicas { get; set; }
        public DbSet<HorasVuelo> HorasVuelos { get; set; }

    }
}