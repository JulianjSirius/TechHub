using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechHub.Domain.Entidades
{
    public class Avion
    {
        [Key]
        public int Id { get; set; }

        [Column("Modelo")]
        public string Modelo { get; set; } = string.Empty;

        [Column("Capacidad")]
        public int Capacidad { get; set; }
    }
}