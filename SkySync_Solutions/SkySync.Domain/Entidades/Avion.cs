using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkySync.Domain.Entidades
{
    public class Avion
    {
        [Key]
        public int Id { get; set; }

        [Column("Modelo")]
        public string Modelo { get; set; } = string.Empty;

        [Column("Capacidad")]
        public int Capacidad { get; set; }

        [Column("Matricula")]
        public string Matricula { get; set; } = string.Empty;
    }
}