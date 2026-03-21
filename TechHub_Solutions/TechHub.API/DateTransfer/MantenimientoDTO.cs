namespace TechHub.API.DateTransfer
{
    public class MantenimientoDTO
    {
        public int UsuarioId { get; set; }
        public int? ProductoId { get; set; }
        public DateTime Fecha { get; set; }
        public string Tipo { get; set; } = "Mantenimiento";
        public string? Notas { get; set; }
    }
}