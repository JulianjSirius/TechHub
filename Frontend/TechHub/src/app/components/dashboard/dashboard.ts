import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CalendarComponent } from '../shared/calendar/calendar';
import { ChartsComponent } from '../shared/charts/charts';
import { Practica } from '../../models/practica';
import { HorasVuelo } from '../../models/horas-vuelo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, DatePipe, CalendarComponent, ChartsComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  status = signal('');
  loading = signal(false);

  practicas = signal<Practica[]>([]);
  horasVuelo = signal<HorasVuelo[]>([]);
  dataLoading = signal(false);

  private api = inject(ApiService);
  protected readonly auth = inject(AuthService);

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const user = this.auth.user();
    if (!user) return;
    const uid = typeof user.id === 'number' ? user.id : Number(user.id);

    this.dataLoading.set(true);

    this.api.getPracticas(uid).subscribe({
      next: (data) => {
        this.practicas.set(data);
        this.checkDone();
      },
      error: () => {
        this.practicas.set([]);
        this.checkDone();
      },
    });

    this.api.getHorasVuelo(uid).subscribe({
      next: (data) => {
        this.horasVuelo.set(data);
        this.checkDone();
      },
      error: () => {
        this.horasVuelo.set([]);
        this.checkDone();
      },
    });
  }

  private loadedCount = 0;
  private checkDone() {
    this.loadedCount++;
    if (this.loadedCount >= 2) {
      this.dataLoading.set(false);
      this.loadedCount = 0;
    }
  }

  get totalHorasVuelo(): number {
    return this.horasVuelo().reduce((s, h) => s + h.horas, 0);
  }

  get totalHorasPracticas(): number {
    return this.practicas().reduce((s, p) => s + p.horas, 0);
  }

  get completadas(): number {
    return this.practicas().filter((p) => p.completada).length;
  }

  probarConexion() {
    this.status.set('');
    this.loading.set(true);

    this.api.getUsuarios().subscribe({
      next: () => {
        this.status.set('Conexión OK');
        this.loading.set(false);
      },
      error: (err) => {
        this.status.set(
          `Error de conexión: ${err?.message ?? err?.statusText ?? err?.status ?? 'desconocido'}`,
        );
        this.loading.set(false);
      },
    });
  }
}
