import { Component, inject, signal, OnInit } from '@angular/core'; // 1. Agregamos OnInit
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';
import { Vuelo } from '../../../models/vuelo';
import { Aeropuerto } from '../../../models/aeropuerto';

@Component({
  selector: 'app-registro-vuelo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-vuelo.html',
  // Recuerda vaciar el archivo CSS para usar solo Tailwind
  styleUrls: ['./registro-vuelo.css'],
})
export class RegistroVuelo implements OnInit {
  // 2. Implementamos OnInit
  origen = signal('');
  destino = signal('');
  fechaSalida = signal('');
  mensaje = signal('');
  error = signal('');
  loading = signal(false);

  // 3. NUEVO: Signal para guardar la lista de aeropuertos que viene de la BD
  aeropuertosLista = signal<Aeropuerto[]>([]);

  private api = inject(ApiService);
  private auth = inject(AuthService);

  // 4. NUEVO: Al abrir la pantalla, pedimos los aeropuertos al backend
  ngOnInit() {
    this.api.getAeropuertos().subscribe({
      next: (data) => {
        this.aeropuertosLista.set(data);
      },
      error: (err) => {
        console.error('Error al cargar aeropuertos:', err);
        this.error.set('Error al cargar la lista de aeropuertos. Verifica la conexión.');
      },
    });
  }

  get destinosDisponibles(): Aeropuerto[] {
    return this.aeropuertosLista().filter((aeropuerto) => aeropuerto.ciudad !== this.origen());
  }

  onOrigenChange(origen: string) {
    const destinoActual = this.destino();
    this.origen.set(origen);
    if (destinoActual === origen) {
      this.destino.set('');
    }
  }

  onDestinoChange(destino: string) {
    this.destino.set(destino);
  }

  registrar() {
    this.mensaje.set('');
    this.error.set('');

    if (!this.auth.isPiloto()) {
      this.error.set('Solo un piloto autenticado puede registrar vuelos.');
      return;
    }

    if (!this.origen() || !this.destino() || !this.fechaSalida()) {
      this.error.set('Completa los campos obligatorios.');
      return;
    }

    if (this.origen() === this.destino()) {
      this.error.set('Origen y destino no pueden ser iguales.');
      return;
    }

    // CAPTURAR el piloto (usuario logueado)
    const user = this.auth.user();
    if (!user) {
      this.error.set('Debes iniciar sesión para registrar un vuelo.');
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
        // Limpiamos los campos
        this.origen.set('');
        this.destino.set('');
        this.fechaSalida.set('');
      },
      error: (err) => {
        this.error.set(err?.error?.mensaje ?? 'No se pudo registrar el vuelo.');
        this.loading.set(false);
      },
    });
  }
}
