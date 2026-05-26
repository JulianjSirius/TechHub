using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechHub.Domain.Entidades
{
    public class Reserva
    {
        [Key]
        public int Id { get; set; }

        [Column("UsuarioId")]
        public int UsuarioId { get; set; }

        [Column("ClaseId")]
        public int ClaseId { get; set; }

        [Column("VueloId")]
        public int VueloId { get; set; }

        [Column("FechaReserva")]
        public DateTime FechaReserva { get; set; }
    }
}