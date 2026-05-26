import { Component, signal, OnInit, inject } from '@angular/core';
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
  imports: [],
  templateUrl: './charts.html',
  styleUrls: ['./charts.css'],
})
export class ChartsComponent implements OnInit {
  private api = inject(ApiService);
  protected auth = inject(AuthService);

  data = signal<ProgressData | null>(null);
  loading = signal(false);

  readonly META_LICENCIA = 40;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    const userId = this.auth.user()?.id;
    if (!userId) return;

    const uid = typeof userId === 'number' ? userId : Number(userId);
    
    Promise.all([
      new Promise<void>((resolve) => {
        this.api.getHorasVuelo(uid).subscribe({
          next: (horas) => {
            const totalHoras = horas.reduce((sum, h) => sum + h.horas, 0);
            
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const horasPorMes: Record<string, number> = {};
            
            horas.forEach(h => {
              const d = new Date(h.fecha);
              const key = `${meses[d.getMonth()]}`;
              horasPorMes[key] = (horasPorMes[key] || 0) + h.horas;
            });
            
            const horasMes = Object.entries(horasPorMes).map(([mes, horas]) => ({ mes, horas: Math.round(horas * 10) / 10 }));
            
            this.data.update(d => ({
              ...(d || { completadas: 0, totalPracticas: 0 }),
              totalHoras,
              horasMes,
              metaHoras: this.META_LICENCIA,
            }));
            resolve();
          },
          error: () => resolve()
        });
      }),
      new Promise<void>((resolve) => {
        this.api.getPracticas(uid).subscribe({
          next: (practicas) => {
            const completadas = practicas.filter(p => p.completada).length;
            this.data.update(d => ({
              ...(d || { totalHoras: 0, horasMes: [], metaHoras: this.META_LICENCIA }),
              completadas,
              totalPracticas: practicas.length,
            }));
            resolve();
          },
          error: () => resolve()
        });
      })
    ]).then(() => this.loading.set(false));
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
    return Math.max(...d.horasMes.map(h => h.horas), 1);
  }
}
