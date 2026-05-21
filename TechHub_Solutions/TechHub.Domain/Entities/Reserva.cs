using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace TechHub.Domain.Entidades
{
    public class Reserva
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("UsuarioId")]
        public int UsuarioId { get; set; }

        [Required]
        [Column("ClaseId")]
        public int ClaseId { get; set; }

        [Required]
        [Column("FechaReserva")]
        public DateTime FechaReserva { get; set; } = DateTime.UtcNow;

        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        [ForeignKey("ClaseId")]
        public Clase? Clase { get; set; }



    }
}




