import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Piloto } from '../../models/piloto';

@Component({
  selector: 'app-registro-piloto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-piloto.html',
  styleUrls: ['./registro-piloto.css'],
})
export class RegistroPiloto {
  nombre = signal('');
  licencia = signal('');
  mensaje = signal('');
  error = signal('');
  loading = signal(false);

  private api = inject(ApiService);

  registrar() {
    this.mensaje.set('');
    this.error.set('');

    if (!this.nombre() || !this.licencia()) {
      this.error.set('Completa los campos obligatorios.');
      return;
    }

    const payload: Piloto = {
      nombre: this.nombre(),
      licencia: this.licencia(),
    };

    this.loading.set(true);

    this.api.crearPiloto(payload).subscribe({
      next: (piloto) => {
        this.mensaje.set(`Piloto registrado: ${piloto.nombre}.`);
        this.loading.set(false);
        this.nombre.set('');
        this.licencia.set('');
      },
      error: (err) => {
        this.error.set(err?.error ?? 'No se pudo registrar el piloto.');
        this.loading.set(false);
      },
    });
  }
}
