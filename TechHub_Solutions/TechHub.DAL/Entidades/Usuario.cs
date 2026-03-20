using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechHub.DAL.Entidades
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Column("Nombre")] 
        public string Nombre { get; set; } = string.Empty;

        [Column("Correo")] 
        public string Correo { get; set; } = string.Empty;

        [Column("Contrasena")]
        public string Contrasena { get; set; } = string.Empty;
    }
}