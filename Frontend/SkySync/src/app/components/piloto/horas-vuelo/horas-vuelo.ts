import { Component, signal, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';
import { HorasVuelo } from '../../../models/horas-vuelo';
import { Aeropuerto } from '../../../models/aeropuerto';

@Component({
  selector: 'app-horas-vuelo',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './horas-vuelo.html',
  styleUrls: ['./horas-vuelo.css'],
})
export class HorasVueloComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  horas = signal<HorasVuelo[]>([]);
  aeropuertos = signal<Aeropuerto[]>([]);
  loading = signal(false);
  error = signal('');
  saving = signal(false);

  formVisible = signal(false);

  form = signal<Omit<HorasVuelo, 'id' | 'usuarioId'>>({
    fecha: new Date().toISOString().split('T')[0],
    horas: 1,
    tipoVuelo: 'Local',
    origen: '',
    destino: '',
    notas: '',
  });

  ngOnInit() {
    this.loadAeropuertos();
    this.loadHoras();
  }

  get destinosDisponibles(): Aeropuerto[] {
    const origenSeleccionado = this.form().origen;
    return this.aeropuertos().filter((aeropuerto) => aeropuerto.nombre !== origenSeleccionado);
  }

  onOrigenChange(origen: string) {
    const destinoActual = this.form().destino;
    this.form.set({
      ...this.form(),
      origen,
      destino: destinoActual === origen ? '' : destinoActual,
    });
  }

  onDestinoChange(destino: string) {
    this.form.set({ ...this.form(), destino });
  }

  loadAeropuertos() {
    this.api.getAeropuertos().subscribe({
      next: (data) => {
        this.aeropuertos.set(data);
      },
      error: () => {
        this.error.set('Error al cargar aeropuertos');
      },
    });
  }

  get usuarioId(): number {
    const user = this.auth.user();
    if (!user) return 0;
    return typeof user.id === 'number' ? user.id : Number(user.id);
  }

  loadHoras() {
    this.loading.set(true);
    this.error.set('');
    const uid = this.usuarioId;
    if (!uid) {
      this.loading.set(false);
      return;
    }

    this.api.getHorasVuelo(uid).subscribe({
      next: (data) => {
        this.horas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar horas de vuelo');
        this.loading.set(false);
      },
    });
  }

  saveHoras() {
    const f = this.form();
    if (!f.fecha || !f.horas || !f.origen || !f.destino) return;
    if (f.origen === f.destino) {
      this.error.set('Origen y destino no pueden ser iguales');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.api
      .crearHorasVuelo({
        usuarioId: this.usuarioId,
        ...f,
      } as HorasVuelo)
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.formVisible.set(false);
          this.form.set({
            fecha: new Date().toISOString().split('T')[0],
            horas: 1,
            tipoVuelo: 'Local',
            origen: '',
            destino: '',
            notas: '',
          });
          this.loadHoras();
        },
        error: () => {
          this.error.set('Error al guardar horas de vuelo');
          this.saving.set(false);
        },
      });
  }

  deleteHoras(id: number) {
    this.api.eliminarHorasVuelo(id).subscribe({
      next: () => this.loadHoras(),
      error: () => this.error.set('Error al eliminar registro'),
    });
  }

  get totalHoras(): number {
    return this.horas().reduce((s, h) => s + h.horas, 0);
  }
}
