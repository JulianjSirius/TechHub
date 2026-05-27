import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth'; // Inyectar Auth
import { Vuelo } from '../../models/vuelo';

@Component({
  selector: 'app-vuelos',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './vuelos.html',
  styleUrls: ['./vuelos.css'],
})
export class Vuelos implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService); // Publico para poder verlo en HTML
  
  vuelos = signal<Vuelo[]>([]);
  loading = signal(true);
  error = signal('');
  mensaje = signal(''); // Para mostrar alertas de éxito

  ngOnInit() {
    this.api.getVuelos().subscribe({
      next: (data) => {
        this.vuelos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los vuelos.');
        this.loading.set(false);
      }
    });
  }

  agendarVuelo(vueloId: number) {
    const userId = this.auth.userId();
    if (!userId) {
      this.error.set('Debes iniciar sesión para agendar.');
      return;
    }

    this.loading.set(true);
    this.api.agendarVuelo({
      usuarioId: Number(userId),
      vueloId: vueloId,
      claseId: 1, // o el ID base que uses
      asiento: '12A' // Lógica futura de asientos
    }).subscribe({
      next: () => {
        this.mensaje.set('¡Vuelo agendado con éxito! Ahora está en proceso.');
        this.loading.set(false);
        setTimeout(() => this.mensaje.set(''), 3000);
      },
      error: () => {
        this.error.set('Error al agendar el vuelo.');
        this.loading.set(false);
      }
    });
  }
}