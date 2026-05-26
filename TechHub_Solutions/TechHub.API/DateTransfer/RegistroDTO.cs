namespace TechHub.API.DateTransfer
{
    public class RegistroDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public string ConfirmarContrasena { get; set; } = string.Empty;
        public string Rol { get; set; } = "Pasajero";
        public string? Licencia { get; set; }
    }
}
