import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Vuelo } from '../../models/vuelo';

@Component({
  selector: 'app-registro-vuelo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-vuelo.html',
  styleUrls: ['./registro-vuelo.css'],
})
export class RegistroVuelo {
  origen = signal('');
  destino = signal('');
  fechaSalida = signal('');
  mensaje = signal('');
  error = signal('');
  loading = signal(false);

  private api = inject(ApiService);

  registrar() {
    this.mensaje.set('');
    this.error.set('');

    if (!this.origen() || !this.destino() || !this.fechaSalida()) {
      this.error.set('Completa los campos obligatorios.');
      return;
    }

    const payload: Vuelo = {
      origen: this.origen(),
      destino: this.destino(),
      fechaSalida: this.fechaSalida(),
    };

    this.loading.set(true);

    this.api.crearVuelo(payload).subscribe({
      next: (vuelo) => {
        this.mensaje.set(`Vuelo registrado: ${vuelo.origen} - ${vuelo.destino}.`);
        this.loading.set(false);
        this.origen.set('');
        this.destino.set('');
        this.fechaSalida.set('');
      },
      error: (err) => {
        this.error.set(err?.error ?? 'No se pudo registrar el vuelo.');
        this.loading.set(false);
      },
    });
  }
}
