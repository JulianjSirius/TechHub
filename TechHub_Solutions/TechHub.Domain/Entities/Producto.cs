using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechHub.Domain.Entidades
{
    public class Producto
    {
        [Key]
        public int Id { get; set; }

        [Column("nombre")]
        public required string Nombre { get; set; }

        [Column("descripcion")]
        public string? Descripcion { get; set; }
        [Column("precio")]
        public decimal Precio { get; set; }

        [Column("stock")]
        public int Stock { get; set; }

        [Column("categoria")]
        public string? Categoria { get; set; }
    }
}