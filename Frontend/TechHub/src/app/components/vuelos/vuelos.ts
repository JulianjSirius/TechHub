import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api';
import { Vuelo } from '../../models/vuelo';

@Component({
  selector: 'app-vuelos',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './vuelos.html',
  styleUrls: ['./vuelos.css'],
})
export class Vuelos {
  private api = inject(ApiService);

  loading = signal(false);
  error = signal('');
  vuelos = signal<Vuelo[]>([]);
  skeletons = Array.from({ length: 4 });

  ngOnInit() {
    this.cargarVuelos();
  }

  cargarVuelos() {
    this.loading.set(true);
    this.error.set('');

    this.api.getVuelos().subscribe({
      next: (vuelos) => {
        const ordenados = [...(vuelos ?? [])].sort(
          (a, b) => new Date(a.fechaSalida).getTime() - new Date(b.fechaSalida).getTime(),
        );
        this.vuelos.set(ordenados);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los vuelos.');
        this.loading.set(false);
      },
    });
  }
}
