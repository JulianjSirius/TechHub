import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  status = signal('');
  data = signal<any>(null);
  loading = signal(false);

  private api = inject(ApiService);
  protected readonly auth = inject(AuthService);

  probarConexion() {
    this.status.set('');
    this.data.set(null);
    this.loading.set(true);

    this.api.getUsuarios().subscribe({
      next: (result) => {
        this.data.set(result);
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
