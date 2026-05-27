import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css'],
})
export class Agenda implements OnInit {
  misViajes = signal<any[]>([]);
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

    this.api.getMisReservas(uid).subscribe({
      next: (reservas) => this.misViajes.set(reservas),
      error: (err) => console.error('Error al cargar viajes:', err),
    });
  }
}
