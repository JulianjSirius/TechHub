import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guia-usuario',
  imports: [CommonModule],
  templateUrl: './guia-usuario.html',
  styleUrls: ['./guia-usuario.css'],
})
export class GuiaUsuario {

  pasos = [
    {
      numero: 1,
      titulo: 'Explora el Catálogo',
      descripcion:
        'Navega por nuestra sección de Productos. Encontrarás Hardware de última generación y Licencias de Software profesional.',
      icono: '💻',
    },
{
      numero: 2,
      titulo: 'Selecciona tu Producto',
      descripcion:
        'Haz clic en el producto que te interese para ver detalles, especificaciones y opciones de compra y pago.',
      icono: '🔍',

},
    {
      numero: 3,
      titulo: 'Agenda tu clase',
      descripcion:
        '¿Quieres aprender a usar tu nuevo software? Agenda una clase con nuestros expertos para sacar el máximo provecho de tu compra.',
      icono: '📅',
    },
  ];
}
