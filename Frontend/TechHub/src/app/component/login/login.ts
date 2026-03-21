import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Login as LoginModel } from '../../models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';

  constructor(
    private Service: ApiService,
    private router: Router,
  ) {}

  iniciarSesion() {
    this.mensajeError = '';

    if (!this.correo || !this.contrasena) {
      this.mensajeError = 'Por favor, ingresa correo y contraseña.';
      return;
    }

    const credenciales: LoginModel = {
      correo: this.correo,
      contrasena: this.contrasena,
    };

    this.Service.login(credenciales).subscribe({
      next: (usuario) => {
        console.log('Login exitoso:', usuario);
        this.router.navigate(['/Dashboard']);
        this.correo = '';
        this.contrasena = '';
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.mensajeError = 'Correo o contraseña incorrectos. Intenta de nuevo.';
      },
    });
  }
}
