import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-opciones',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './opciones.html',
  styleUrls: ['./opciones.css'],
})
export class Opciones {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  nombre = signal('');
  direccion = signal('');

  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  confirmarContrasena = signal('');

  perfilMensaje = signal('');
  perfilError = signal('');
  perfilLoading = signal(false);

  seguridadMensaje = signal('');
  seguridadError = signal('');
  seguridadLoading = signal(false);

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (!user) return;

      this.nombre.set(user.nombre ?? '');
      this.direccion.set(user.direccion ?? '');
    });
  }

  guardarPerfil() {
    const user = this.auth.user();
    this.perfilMensaje.set('');
    this.perfilError.set('');

    if (!user) {
      this.perfilError.set('Debes iniciar sesion para actualizar tu perfil.');
      return;
    }

    const nombre = this.nombre().trim();
    if (!nombre) {
      this.perfilError.set('El nombre es obligatorio.');
      return;
    }

    this.perfilLoading.set(true);
    this.api
      .actualizarPerfil(Number(user.id), {
        nombre,
        direccion: this.direccion().trim() || null,
      })
      .subscribe({
        next: (updated) => {
          this.perfilMensaje.set('Perfil actualizado correctamente.');
          this.auth.updateProfile({
            nombre: updated.nombre,
            direccion: updated.direccion ?? '',
          });
          this.perfilLoading.set(false);
        },
        error: (err) => {
          this.perfilError.set(err?.error ?? 'No se pudo actualizar el perfil.');
          this.perfilLoading.set(false);
        },
      });
  }

  cambiarContrasena() {
    const user = this.auth.user();
    this.seguridadMensaje.set('');
    this.seguridadError.set('');

    if (!user) {
      this.seguridadError.set('Debes iniciar sesion para cambiar tu contraseña.');
      return;
    }

    if (!this.contrasenaActual() || !this.nuevaContrasena()) {
      this.seguridadError.set('Completa la contraseña actual y la nueva.');
      return;
    }

    if (this.nuevaContrasena() !== this.confirmarContrasena()) {
      this.seguridadError.set('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.seguridadLoading.set(true);
    this.api
      .cambiarContrasena(Number(user.id), {
        contrasenaActual: this.contrasenaActual(),
        nuevaContrasena: this.nuevaContrasena(),
      })
      .subscribe({
        next: (resp) => {
          this.seguridadMensaje.set(resp?.mensaje ?? 'Contraseña actualizada.');
          this.contrasenaActual.set('');
          this.nuevaContrasena.set('');
          this.confirmarContrasena.set('');
          this.seguridadLoading.set(false);
        },
        error: (err) => {
          this.seguridadError.set(err?.error ?? 'No se pudo cambiar la contraseña.');
          this.seguridadLoading.set(false);
        },
      });
  }
}
