namespace TechHub.DAL.Entidades
{
    public class Mantenimiento
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int? ProductoId { get; set; }
        public DateTime Fecha { get; set; }
        public string Tipo { get; set; } = "Instalación";
        public string Estado { get; set; } = "Pendiente";
        public string? Notas { get; set; }

        // Propiedades de navegación (Estas evitan datos huerfanos y permite saber quien pidio un manteniemiento  )
        public Usuario? Usuario { get; set; }
        public Producto? Producto { get; set; }
    }
}