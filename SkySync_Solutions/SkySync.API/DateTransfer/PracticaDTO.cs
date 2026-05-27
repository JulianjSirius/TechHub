namespace SkySync.API.DateTransfer
{
    public class PracticaDTO
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime Fecha { get; set; }
        public string Tipo { get; set; } = "Teorica";
        public decimal Horas { get; set; }
        public string? Descripcion { get; set; }
        public string? Instructor { get; set; }
        public bool Completada { get; set; }
    }
}
