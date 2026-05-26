import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api';
import { Aeropuerto } from '../../models/aeropuerto';

@Component({
  selector: 'app-aeropuertos',
  standalone: true,
  imports: [],
  templateUrl: './aeropuertos.html',
  styleUrls: ['./aeropuertos.css'],
})
export class Aeropuertos {
  private api = inject(ApiService);

  loading = signal(false);
  error = signal('');
  aeropuertos = signal<Aeropuerto[]>([]);
  skeletons = Array.from({ length: 4 });

  ngOnInit() {
    this.cargarAeropuertos();
  }

  cargarAeropuertos() {
    this.loading.set(true);
    this.error.set('');

    this.api.getAeropuertos().subscribe({
      next: (aeropuertos) => {
        this.aeropuertos.set(aeropuertos ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los aeropuertos.');
        this.loading.set(false);
      },
    });
  }
}
