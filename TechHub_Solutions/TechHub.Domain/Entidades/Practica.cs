using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechHub.Domain.Entidades
{
    public class Practica
    {
        [Key]
        public int Id { get; set; }

        [Column("UsuarioId")]
        public int UsuarioId { get; set; }

        [Column("Fecha")]
        public DateTime Fecha { get; set; }

        [Column("Tipo")]
        public string Tipo { get; set; } = "Teorica";

        [Column("Horas")]
        public decimal Horas { get; set; }

        [Column("Descripcion")]
        public string? Descripcion { get; set; }

        [Column("Instructor")]
        public string? Instructor { get; set; }

        [Column("Completada")]
        public bool Completada { get; set; }
    }
}
