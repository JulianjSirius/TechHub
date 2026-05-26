import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
// 1. IMPORTANTE: Asegúrate de que la ruta a tu AuthService sea la correcta
import { AuthService } from '../../../services/auth'; 
import { Vuelo } from '../../../models/vuelo';

@Component({
  selector: 'app-registro-vuelo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-vuelo.html',
  styleUrls: ['./registro-vuelo.css'],
})
export class RegistroVuelo {
  origen = signal('');
  destino = signal('');
  fechaSalida = signal('');
  mensaje = signal('');
  error = signal('');
  loading = signal(false);

  private api = inject(ApiService);
  // 2. INYECTAR el servicio que maneja la sesión
  private auth = inject(AuthService); 

  registrar() {
    this.mensaje.set('');
    this.error.set('');

    if (!this.origen() || !this.destino() || !this.fechaSalida()) {
      this.error.set('Completa los campos obligatorios.');
      return;
    }

    // 3. CAPTURAR el piloto (usuario logueado)
    const user = this.auth.user();
    if (!user) {
      this.error.set('Debes iniciar sesión para registrar un vuelo.');
      return;
    }
    
    // Asegurarnos de que el ID sea numérico
    const pilotoIdReal = typeof user.id === 'number' ? user.id : Number(user.id);

    // 4. AGREGAR el pilotoId al payload
    const payload: Vuelo = {
      origen: this.origen(),
      destino: this.destino(),
      fechaSalida: this.fechaSalida(),
      pilotoId: pilotoIdReal // <--- Aquí se inyecta dinámicamente
    };

    this.loading.set(true);

    this.api.crearVuelo(payload).subscribe({
      next: (vuelo) => {
        this.mensaje.set(`Vuelo registrado: ${vuelo.origen} - ${vuelo.destino}.`);
        this.loading.set(false);
        this.origen.set('');
        this.destino.set('');
        this.fechaSalida.set('');
      },
      error: (err) => {
        this.error.set(err?.error ?? 'No se pudo registrar el vuelo.');
        this.loading.set(false);
      },
    });
  }
}