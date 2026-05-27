import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para el HTML
import { FormsModule } from '@angular/forms'; // Necesario para los inputs (ngModel)
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth'; // Necesario para validar piloto
import { Aeropuerto } from '../../models/aeropuerto';

@Component({
  selector: 'app-aeropuertos',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- ¡Importante agregarlos aquí!
  templateUrl: './aeropuertos.html',
  styleUrls: ['./aeropuertos.css'],
})
export class Aeropuertos implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService); // Hacerlo público para que el HTML lo lea

  loading = signal(false);
  error = signal('');
  aeropuertos = signal<Aeropuerto[]>([]);
  skeletons = Array.from({ length: 4 });

  // Variables bindeadas al formulario para añadir un nuevo aeropuerto
  nuevoNombre = '';
  nuevaCiudad = '';

  ngOnInit() {
    this.cargarAeropuertos();
  }

  cargarAeropuertos() {
    this.loading.set(true);
    this.error.set('');

    this.api.getAeropuertos().subscribe({
      next: (aeropuertos) => {
        this.aeropuertos.set(aeropuertos ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los aeropuertos.');
        this.loading.set(false);
      },
    });
  }

  // ==========================================
  // NUEVAS FUNCIONES PARA EL PILOTO
  // ==========================================

  agregarAeropuerto() {
    if (!this.nuevoNombre || !this.nuevaCiudad) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    
    const pilotoId = Number(this.auth.userId());
    if (!pilotoId) {
      alert('Error: No se pudo identificar la credencial del Piloto.');
      return;
    }
  }

  cambiarEstado(id: number | undefined, evento: Event) {
    if (!id) return;
    
    const nuevoEstado = (evento.target as HTMLSelectElement).value; 
    
    this.api.actualizarEstadoAeropuerto(id, nuevoEstado).subscribe({
      next: () => {
        this.cargarAeropuertos(); // Recarga la cuadrícula para actualizar el color
      },
      error: () => {
        alert('Error al intentar cambiar el estatus del aeropuerto.');
      }
    });
  }

  // Retorna las clases de Tailwind dinámicas según el estado
  getColorEstado(estado: string): string {
    switch(estado) {
      case 'Disponible': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Sin uso': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Mantenimiento': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  }
}