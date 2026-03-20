import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from './services/api'; // Importamos el servicio

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    RouterLink,
    RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('TechHub');

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
      }
    });
  }
}