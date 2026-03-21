namespace TechHub.API.DateTransfer
{
    public class ClaseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int CuposMaximos { get; set; }
        public int CuposDisponibles { get; set; }
       
    }
}