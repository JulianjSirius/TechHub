using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechHub.Domain.Entidades
{
    public class Vuelo
    {
        [Key]
        public int Id { get; set; }

        [Column("Origen")]
        public string Origen { get; set; } = string.Empty;

        [Column("Destino")]
        public string Destino { get; set; } = string.Empty;

        [Column("FechaSalida")]
        public DateTime FechaSalida { get; set; }

        [Column("CuposMaximos")]
        public int CuposMaximos { get; set; }

        [Column("CuposDisponibles")]
        public int CuposDisponibles { get; set; }
    }
}