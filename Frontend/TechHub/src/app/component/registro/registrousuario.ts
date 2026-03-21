import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { RegistroUsuario } from '../../models/registrousuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  nombre = '';
  correo = '';
  contrasena = '';
  confirmContrasena = '';

  mensaje = '';
  error = '';
  loading = false;

  private api = inject(ApiService);
  private router = inject(Router);

  registrar() {
    this.mensaje = '';
    this.error = '';

    if (!this.nombre || !this.correo || !this.contrasena || !this.confirmContrasena) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.contrasena !== this.confirmContrasena) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const registro: RegistroUsuario = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      confirmContrasena: this.confirmContrasena,
    };

    this.loading = true;

    this.api.registerUser(registro).subscribe({
      next: (usuario) => {
        this.mensaje = `Usuario registrado correctamente. ${usuario.nombre}!`;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 1200);
      },
      error: (err) => {
        this.error = err?.error ?? 'No se pudo registrar. Intenta de nuevo.';
        this.loading = false;
      },
    });
  }
}
