import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { ApiService } from './services/api';
import { AuthService } from './services/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('TechHub');
  protected readonly sidebarOpen = signal(false);
  protected readonly userMenuOpen = signal(false);
  protected readonly auth = inject(AuthService);

  protected readonly authRoutes = new Set(['/Login', '/Registro', '/RecuperarContrasena']);

  protected readonly currentUrl = toSignal(
    inject(Router).events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: '' },
  );

  protected readonly isAuthPage = computed(
    () =>
      this.authRoutes.has(this.currentUrl()) ||
      this.currentUrl() === '' ||
      this.currentUrl() === '/',
  );

  protected readonly pageTitle = computed(() => {
    const url = this.currentUrl();
    const titles: Record<string, string> = {
      '/Dashboard': 'Dashboard',
      '/guia-usuario': 'Guía de uso',
      '/Vuelos': 'Vuelos',
      '/Aeropuertos': 'Aeropuertos',
      '/Pilotos': 'Registro de Pilotos',
      '/RegistroVuelo': 'Nuevo Vuelo',
      '/Practicas': 'Mis Prácticas',
      '/HorasVuelo': 'Horas de Vuelo',
    };
    return titles[url] || 'TechHub';
  });

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

  private readonly router = inject(Router);
  private apiService = inject(ApiService);

  ngOnInit() {
    this.apiService.getUsuarios().subscribe({
      next: (datos) => {
        console.log('API conectada:', datos.length, 'usuarios');
      },
      error: (error) => {
        console.error('Error al conectar con API:', error);
      },
    });
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
  logout() {
    this.auth.clear();
    this.userMenuOpen.set(false);
    this.closeSidebar();
    this.router.navigate(['/Login']);
  }
}
