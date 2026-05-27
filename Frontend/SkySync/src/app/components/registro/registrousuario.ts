import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { RegistroUsuario } from '../../models/registrousuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  nombre = signal('');
  correo = signal('');
  contrasena = signal('');
  ConfirmarContrasena = signal('');
  rol = signal('Pasajero');
  licencia = signal('');

  mensaje = signal('');
  error = signal('');
  loading = signal(false);

  private api = inject(ApiService);
  private router = inject(Router);

  registrar() {
    this.mensaje.set('');
    this.error.set('');

    if (!this.nombre() || !this.correo() || !this.contrasena() || !this.ConfirmarContrasena()) {
      this.error.set('Completa todos los campos.');
      return;
    }

    if (this.contrasena() !== this.ConfirmarContrasena()) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    if (this.rol() === 'Piloto' && !this.licencia()) {
      this.error.set('Ingresa tu licencia de piloto.');
      return;
    }

    const registro: RegistroUsuario = {
      nombre: this.nombre(),
      correo: this.correo(),
      contrasena: this.contrasena(),
      ConfirmarContrasena: this.ConfirmarContrasena(),
      rol: this.rol(),
      licencia: this.rol() === 'Piloto' ? this.licencia() : undefined,
    };

    this.loading.set(true);

    this.api.registerUser(registro).subscribe({
      next: (usuario) => {
        this.mensaje.set(`Usuario registrado correctamente. ${usuario.nombre}!`);
        this.loading.set(false);
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 1200);
      },
      error: (err) => {
        this.error.set(err?.error ?? 'No se pudo registrar. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }
}
