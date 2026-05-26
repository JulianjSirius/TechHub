import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Login as LoginModel } from '../../models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  correo = signal('');
  contrasena = signal('');
  mensajeError = signal('');
  loading = signal(false);

  constructor(
    private Service: ApiService,
    private router: Router,
    private auth: AuthService,
  ) {}

  iniciarSesion() {
    this.mensajeError.set('');

    if (!this.correo() || !this.contrasena()) {
      this.mensajeError.set('Por favor, ingresa correo y contraseña.');
      return;
    }

    const credenciales: LoginModel = {
      correo: this.correo(),
      contrasena: this.contrasena(),
    };

    this.loading.set(true);

    this.Service.login(credenciales).subscribe({
      next: (usuario) => {
        this.auth.setUser(usuario);
        this.router.navigate(['/Dashboard']);
        this.correo.set('');
        this.contrasena.set('');
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.mensajeError.set('Correo o contraseña incorrectos. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }
}
