import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword {
  correo = signal('');
  nuevaContrasena = signal('');
  confirmarContrasena = signal('');

  mensaje = signal('');
  error = signal('');
  sending = signal(false);

  private api = inject(ApiService);
  private router = inject(Router);

  enviarSolicitud() {
    this.mensaje.set('');
    this.error.set('');

    if (!this.correo() || !this.nuevaContrasena()) {
      this.error.set('Completa el correo y la nueva contraseña.');
      return;
    }

    if (this.nuevaContrasena() !== this.confirmarContrasena()) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.sending.set(true);
    this.api
      .recuperarContrasena({
        correo: this.correo(),
        nuevaContrasena: this.nuevaContrasena(),
      })
      .subscribe({
        next: (resp) => {
          this.mensaje.set(resp?.mensaje ?? 'Contraseña restablecida.');
          this.sending.set(false);
        },
        error: (err) => {
          this.error.set(err?.error ?? 'No se pudo recuperar la contraseña.');
          this.sending.set(false);
        },
      });
  }

  volverAlLogin() {
    this.router.navigate(['/Login']);
  }
}
