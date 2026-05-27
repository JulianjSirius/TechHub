import { Component, signal, OnInit, inject, Input } from '@angular/core';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

interface ProgressData {
  totalHoras: number;
  horasMes: { mes: string; horas: number }[];
  metaHoras: number;
  completadas: number;
  totalPracticas: number;
}

@Component({
  selector: 'app-charts',
  standalone: true,
  templateUrl: './charts.html',
  styleUrls: ['./charts.css'],
})
export class ChartsComponent implements OnInit {
  @Input() totalHorasVuelo: number = 0;

  private api = inject(ApiService);
  protected auth = inject(AuthService);

  data = signal<ProgressData | null>(null);
  loading = signal(false);

  readonly META_LICENCIA = 40;

  ngOnInit() {
    // Si totalHorasVuelo es > 0, significa que el Dashboard ya envió datos.
    if (this.totalHorasVuelo === 0) {
      this.loadData();
    }
  }

  loadData() {
    this.loading.set(true);
    const userId = this.auth.user()?.id;
    if (!userId) {
      console.debug('ChartsComponent.loadData: no userId found');
      this.loading.set(false);
      return;
    }

    const uid = typeof userId === 'number' ? userId : Number(userId);

    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    const pHoras = new Promise<{ totalHoras: number; horasPorMes: Record<string, number> }>(
      (resolve) => {
        this.api.getHorasVuelo(uid).subscribe({
          next: (horas) => {
            const totalHoras = horas.reduce((sum, h) => sum + h.horas, 0);
            const horasPorMes: Record<string, number> = {};
            horas.forEach((h) => {
              const d = new Date(h.fecha);
              const key = `${meses[d.getMonth()]}`;
              horasPorMes[key] = (horasPorMes[key] || 0) + h.horas;
            });
            resolve({ totalHoras, horasPorMes });
          },
          error: () => resolve({ totalHoras: 0, horasPorMes: {} }),
        });
      },
    );

    const pPract = new Promise<{
      completadas: number;
      totalPracticas: number;
      horasPorMes: Record<string, number>;
    }>((resolve) => {
      this.api.getPracticas(uid).subscribe({
        next: (practicas) => {
          const completadas = practicas.filter((p) => p.completada).length;
          const horasPorMes: Record<string, number> = {};
          practicas.forEach((p) => {
            if (!p.fecha) return;
            const d = new Date(p.fecha);
            const key = `${meses[d.getMonth()]}`;
            horasPorMes[key] = (horasPorMes[key] || 0) + (p.horas || 0);
          });
          resolve({ completadas, totalPracticas: practicas.length, horasPorMes });
        },
        error: () => resolve({ completadas: 0, totalPracticas: 0, horasPorMes: {} }),
      });
    });

    Promise.all([pHoras, pPract])
      .then(([hRes, pRes]) => {
        console.debug('ChartsComponent.loadData: responses', { hRes, pRes });
        // Merge horas por mes: sumar horas de vuelo + horas de prácticas
        const merged: Record<string, number> = { ...hRes.horasPorMes };
        Object.entries(pRes.horasPorMes).forEach(([m, hrs]) => {
          merged[m] = (merged[m] || 0) + hrs;
        });

        const horasMes = Object.entries(merged)
          .map(([mes, horas]) => ({ mes, horas: Math.round(horas * 10) / 10 }))
          // preserve month ordering
          .sort((a, b) => meses.indexOf(a.mes) - meses.indexOf(b.mes));

        this.data.set({
          totalHoras: hRes.totalHoras,
          horasMes,
          metaHoras: this.META_LICENCIA,
          completadas: pRes.completadas,
          totalPracticas: pRes.totalPracticas,
        });

        console.debug('ChartsComponent.loadData: computed data', this.data());
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('ChartsComponent.loadData: error', err);
        this.loading.set(false);
      });
  }

  get progressPercent(): number {
    const d = this.data();
    if (!d || d.totalHoras === 0) return 0;
    return Math.min(100, Math.round((d.totalHoras / this.META_LICENCIA) * 100));
  }

  get pieChartData(): { label: string; value: number; color: string }[] {
    const d = this.data();
    if (!d || d.horasMes.length === 0) return [];
    return d.horasMes.map((h, i) => ({
      label: h.mes,
      value: h.horas,
      color: `hsl(${210 + i * 30}, 70%, 50%)`,
    }));
  }

  get maxHoras(): number {
    const d = this.data();
    if (!d || d.horasMes.length === 0) return 1;
    return Math.max(...d.horasMes.map((h) => h.horas), 1);
  }
}
