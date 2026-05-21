import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios',
  imports: [],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios {
  servicios = [
    {
      numero: 1,
      titulo: 'Venta de Hardware',
      descripcion:
        'Te ofrecemos equipos de última generación: computadoras, laptops, periféricos y componentes de alta calidad para profesionales y empresas.',
      icono: '🖥️',
    },
    {
      numero: 2,
      titulo: 'Licencias de Software',
      descripcion:
        'Acceso a soluciones de software profesionales. Obten licencias originales y activación inmediata para optimizar tus operaciones.',
      icono: '📦',
    },
    {
      numero: 3,
      titulo: 'Soporte Técnico',
      descripcion:
        'Equipo de expertos disponible para resolver tus dudas, problemas técnicos y brindar asesoramiento personalizado en tus compras.',
      icono: '🛠️',
    },
    {
      numero: 4,
      titulo: 'Entrenamientos Personalizados',
      descripcion:
        'Capacitación especializada en el uso de software y herramientas. Agenda sesiones con nuestros instructores profesionales.',
      icono: '📚',
    },
    {
      numero: 5,
      titulo: 'Asesoramiento Empresarial',
      descripcion:
        'Consultoría tecnológica para empresas. Ayudamos a optimizar tu infraestructura IT y seleccionar las mejores soluciones.',
      icono: '💼',
    },
    {
      numero: 6,
      titulo: 'Mantenimiento y Actualizaciones',
      descripcion:
        'Servicios de actualización y mantenimiento de sistemas. Mantén tu infraestructura segura y funcionando óptimamente.',
      icono: '⚙️',
    },
  ];
}
