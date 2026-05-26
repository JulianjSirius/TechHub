namespace TechHub.API.DateTransfer
{
    public class HorasVueloDTO
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Horas { get; set; }
        public string TipoVuelo { get; set; } = "Local";
        public string? Origen { get; set; }
        public string? Destino { get; set; }
        public string? Notas { get; set; }
    }
}
