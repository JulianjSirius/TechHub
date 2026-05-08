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

  private readonly pageSize = 6;

  loading = signal(false);
  success = signal('');
  error = signal('');

  clases = signal<Clase[]>([]);
  searchTerm = signal('');
  filteredClases = computed(() => {
    const term = this.normalizeTerm(this.searchTerm());
    if (!term) return this.clases();

    return this.clases().filter((clase) => {
      const haystack = this.normalizeTerm(`${clase.nombre} ${clase.descripcion ?? ''}`);
      return haystack.includes(term);
    });
  });
  pageIndex = signal(0);
  visibleClases = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredClases().slice(start, start + this.pageSize);
  });
  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredClases().length / this.pageSize)));
  pageNumbers = computed(() => {
    const total = this.totalPages();
    if (total <= 1) return [];

    const current = this.pageIndex();
    const maxButtons = 5;
    let start = Math.max(0, current - Math.floor(maxButtons / 2));
    let end = Math.min(total - 1, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(0, end - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
  hasPrev = computed(() => this.pageIndex() > 0);
  hasNext = computed(() => this.pageIndex() + 1 < this.totalPages());
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
        this.pageIndex.set(0);
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

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  setPage(index: number) {
    if (index < 0 || index >= this.totalPages()) return;
    this.pageIndex.set(index);
  }

  nextPage() {
    if (this.hasNext()) {
      this.pageIndex.update((current) => current + 1);
    }
  }

  prevPage() {
    if (this.hasPrev()) {
      this.pageIndex.update((current) => current - 1);
    }
  }

  private normalizeTerm(value: string) {
    return value.toLowerCase().trim();
  }
}
