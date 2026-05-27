using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkySync.Domain.Entidades
{
    public class Piloto
    {
        [Key]
        public int Id { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("Licencia")]
        public string Licencia { get; set; } = string.Empty;
    }
}