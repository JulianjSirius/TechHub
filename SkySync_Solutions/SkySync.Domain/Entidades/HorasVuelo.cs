using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkySync.Domain.Entidades
{
    public class HorasVuelo
    {
        [Key]
        public int Id { get; set; }

        [Column("UsuarioId")]
        public int UsuarioId { get; set; }

        [Column("Fecha")]
        public DateTime Fecha { get; set; }

        [Column("Horas")]
        public decimal Horas { get; set; }

        [Column("TipoVuelo")]
        public string TipoVuelo { get; set; } = "Local";

        [Column("Origen")]
        public string? Origen { get; set; }

        [Column("Destino")]
        public string? Destino { get; set; }

        [Column("Notas")]
        public string? Notas { get; set; }
    }
}
