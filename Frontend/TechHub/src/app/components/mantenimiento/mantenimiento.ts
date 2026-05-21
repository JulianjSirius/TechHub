import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Producto } from '../../models/producto';

interface MantenimientoAgendado {
  id: number;
  productoId: number;
  servicioId: number;
  fecha: string;
  notas: string;
  estado: 'Pendiente' | 'Programado' | 'Finalizado';
}

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './mantenimiento.html',
  styleUrls: ['./mantenimiento.css'],
})
export class Mantenimiento {
  private api = inject(ApiService);

  loading = signal(false);
  success = signal('');
  error = signal('');

  productos = signal<Producto[]>([]);
  mantenimientos = signal<MantenimientoAgendado[]>([]);

  productoId = signal<number>(0);
  servicioId = signal<number>(1);
  fecha = signal('');
  notas = signal('');

  servicios = [
    {
      id: 1,
      titulo: 'Mantenimiento preventivo',
      descripcion: 'Revisión y limpieza de sistema para evitar fallos.',
    },
    {
      id: 2,
      titulo: 'Actualización de software',
      descripcion: 'Instalación de parches y versiones actualizadas.',
    },
    {
      id: 3,
      titulo: 'Diagnóstico técnico',
      descripcion: 'Verificación de hardware y software para detección de problemas.',
    },
    {
      id: 4,
      titulo: 'Soporte remoto',
      descripcion: 'Asistencia vía conexión remota para resolución inmediata.',
    },
  ];

  get servicioSeleccionado() {
    return this.servicios.find((s) => s.id === this.servicioId()) ?? this.servicios[0];
  }

  get tieneMantenimientos() {
    return this.mantenimientos().length > 0;
  }

  get totalMantenimientos() {
    return this.mantenimientos().length;
  }

  ngOnInit() {
    this.cargarProductos();
    this.cargarMantenimientosGuardados();
  }

  cargarProductos() {
    this.api.getProductos().subscribe({
      next: (productos) => {
        this.productos.set(productos ?? []);
      },
      error: () => {
        this.productos.set([]);
      },
    });
  }

  cargarMantenimientosGuardados() {
    const data = localStorage.getItem('misMantenimientos');
    if (!data) {
      this.mantenimientos.set([]);
      return;
    }
    const parsed = JSON.parse(data) as Array<MantenimientoAgendado & { estado: string }>;
    const guardados = parsed.map(
      (item): MantenimientoAgendado => ({
        id: item.id,
        productoId: item.productoId,
        servicioId: item.servicioId,
        fecha: item.fecha,
        notas: item.notas,
        estado:
          item.estado === 'Pendiente' ||
          item.estado === 'Programado' ||
          item.estado === 'Finalizado'
            ? (item.estado as 'Pendiente' | 'Programado' | 'Finalizado')
            : 'Programado',
      }),
    );
    this.mantenimientos.set(guardados);
  }

  agendar() {
    const usuarioId = Number(localStorage.getItem('usuarioId') || 0);

    this.success.set('');
    this.error.set('');

    if (!usuarioId || usuarioId <= 0) {
      this.error.set('Debes iniciar sesión antes de agendar mantenimiento.');
      return;
    }

    if (!this.productoId() || !this.fecha()) {
      this.error.set('Selecciona un producto y una fecha.');
      return;
    }

    const request = {
      usuarioId,
      productoId: this.productoId(),
      fecha: this.fecha(),
      tipo: this.servicioSeleccionado.titulo,
      notas: this.notas(),
    };

    this.loading.set(true);
    this.api.crearMantenimiento(request).subscribe({
      next: (resp: { mensaje: string }) => {
        const nuevo: MantenimientoAgendado = {
          id: Date.now(),
          productoId: this.productoId(),
          servicioId: this.servicioId(),
          fecha: this.fecha(),
          notas: this.notas(),
          estado: 'Programado',
        };

        const actual = [...this.mantenimientos(), nuevo];
        this.mantenimientos.set(actual);
        localStorage.setItem('misMantenimientos', JSON.stringify(actual));

        this.success.set(resp.mensaje ?? 'Mantenimiento agendado correctamente.');
        this.productoId.set(0);
        this.fecha.set('');
        this.notas.set('');
        this.servicioId.set(1);

        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err?.error?.mensaje || 'Error al agendar mantenimiento.');
        this.loading.set(false);
      },
    });
  }

  obtenerNombreProducto(productoId: number) {
    const producto = this.productos().find((p) => p.id === productoId);
    return producto?.nombre ?? 'Producto no cargado';
  }

  finalizarMantenimiento(id: number) {
    const lista = [...this.mantenimientos()];
    const idx = lista.findIndex((m) => m.id === id);
    if (idx === -1) {
      this.error.set('Mantenimiento no encontrado.');
      return;
    }

    if (lista[idx].estado === 'Finalizado') {
      this.error.set('El mantenimiento ya se encuentra finalizado.');
      return;
    }

    lista[idx].estado = 'Finalizado';
    this.mantenimientos.set(lista);
    localStorage.setItem('misMantenimientos', JSON.stringify(lista));
    this.success.set('Mantenimiento marcado como finalizado.');
  }

  cancelarMantenimiento(id: number) {
    const lista = this.mantenimientos().filter((item) => item.id !== id);
    this.mantenimientos.set(lista);
    localStorage.setItem('misMantenimientos', JSON.stringify(lista));
    this.success.set('Mantenimiento cancelado.');
  }
}
