namespace TechHub.API.DateTransfer
{
    public class VueloDTO
    {
        public int Id { get; set; }
        public string Origen { get; set; } = string.Empty;
        public string Destino { get; set; } = string.Empty;
        public DateTime FechaSalida { get; set; }
        public int CuposMaximos { get; set; }
        public int CuposDisponibles { get; set; }
    }
}
