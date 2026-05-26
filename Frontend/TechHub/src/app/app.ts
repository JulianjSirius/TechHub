import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from './services/api'; // Importamos el servicio
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('TechHub');
  protected readonly menuOpen = signal(false);
  protected readonly auth = inject(AuthService);
  protected readonly userInitials = computed(() => {
    const name = this.auth.userName().trim();
    if (!name) return 'TH';

    const parts = name.split(' ').filter(Boolean);
    const initials = parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return initials || 'TH';
  });

  protected readonly router = inject(Router);
  private apiService = inject(ApiService);

  ngOnInit() {
    console.log('Intentando conectar con la API de TechHub...');

    this.apiService.getUsuarios().subscribe({
      next: (datos) => {
        console.log('Datos recibidos de la API en C#:', datos);
      },
      error: (error) => {
        console.error('Hubo un error al conectar:', error);
      },
    });
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.auth.clear();
    this.menuOpen.set(false);
    this.router.navigate(['/Login']);
  }
}
