import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  status = '';
  data: any = null;
  loading = false;

  private api = inject(ApiService);

  probarConexion() {
    this.status = '';
    this.data = null;
    this.loading = true;

    this.api.getUsuarios().subscribe({
      next: (result) => {
        this.data = result;
        this.status = 'Conexión OK';
        this.loading = false;
      },
      error: (err) => {
        this.status = `Error de conexión: ${err?.message ?? err?.statusText ?? err?.status ?? 'desconocido'}`;
        this.loading = false;
      },
    });
  }
}
