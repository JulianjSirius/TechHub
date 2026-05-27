using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkySync.Domain.Entidades
{
    public class Clase
    {
        [Key]
        public int Id { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("Descripcion")]
        public string? Descripcion { get; set; }

        [Column("CuposMaximos")]
        public int CuposMaximos { get; set; }

        [Column("CuposDisponibles")]
        public int CuposDisponibles { get; set; }
    }
}