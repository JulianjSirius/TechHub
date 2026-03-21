import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Clase } from '../../models/clases';

interface ClaseReservada {
  id: number;
  claseId: number;
  fecha: string;
  estado: 'Pendiente' | 'Reservada' | 'Finalizada';
}

@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clases.html',
  styleUrls: ['./clases.css'],
})
export class Clases {
  private api = inject(ApiService);

  loading = signal(false);
  success = signal('');
  error = signal('');

  clases = signal<Clase[]>([]);
  clasesReservadas = signal<ClaseReservada[]>([]);

  claseId = signal<number>(0);
  fecha = signal('');

  get tieneClasesReservadas() {
    return this.clasesReservadas().length > 0;
  }

  ngOnInit() {
    this.cargarClases();
    this.cargarClasesGuardadas();
  }

  cargarClases() {
    this.loading.set(true);
    this.error.set('');
    this.api.getClases().subscribe({
      next: (clases) => {
        this.clases.set(clases ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las clases. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  cargarClasesGuardadas() {
    const data = localStorage.getItem('misClases');
    if (!data) {
      this.clasesReservadas.set([]);
      return;
    }

    try {
      const parsed = JSON.parse(data) as ClaseReservada[];
      this.clasesReservadas.set(parsed);
    } catch {
      this.clasesReservadas.set([]);
    }
  }

  reservarClase() {
    const usuarioId = Number(localStorage.getItem('usuarioId') || 0);

    this.success.set('');
    this.error.set('');

    if (!usuarioId || usuarioId <= 0) {
      this.error.set('Debes iniciar sesión antes de reservar una clase.');
      return;
    }

    if (!this.claseId() || !this.fecha()) {
      this.error.set('Selecciona una clase y una fecha.');
      return;
    }

    this.loading.set(true);

    this.api.agendarClase({ usuarioId, claseId: this.claseId() }).subscribe({
      next: (resp: { mensaje: string }) => {
        const nuevo: ClaseReservada = {
          id: Date.now(),
          claseId: this.claseId(),
          fecha: this.fecha(),
          estado: 'Reservada',
        };

        const guardadas = [...this.clasesReservadas(), nuevo];
        this.clasesReservadas.set(guardadas);
        localStorage.setItem('misClases', JSON.stringify(guardadas));

        this.success.set(resp.mensaje ?? 'Clase reservada correctamente.');
        this.claseId.set(0);
        this.fecha.set('');

        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err?.error?.mensaje || 'Error al reservar la clase.');
        this.loading.set(false);
      },
    });
  }

  obtenerNombreClase(claseId: number) {
    const clase = this.clases().find((c) => c.id === claseId);
    return clase?.nombre ?? 'Clase no encontrada';
  }

  finalizarClase(id: number) {
    const lista = [...this.clasesReservadas()];
    const idx = lista.findIndex((c) => c.id === id);
    if (idx === -1) {
      this.error.set('Reserva no encontrada.');
      return;
    }

    if (lista[idx].estado === 'Finalizada') {
      this.error.set('La clase ya se encuentra finalizada.');
      return;
    }

    lista[idx].estado = 'Finalizada';
    this.clasesReservadas.set(lista);
    localStorage.setItem('misClases', JSON.stringify(lista));
    this.success.set('Clase marcada como finalizada.');
  }

  cancelarClase(id: number) {
    const lista = [...this.clasesReservadas()];
    const siguiente = lista.filter((item) => item.id !== id);
    this.clasesReservadas.set(siguiente);
    localStorage.setItem('misClases', JSON.stringify(siguiente));
    this.success.set('Reserva de clase cancelada.');
  }
}
