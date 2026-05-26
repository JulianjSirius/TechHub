import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';

import { Register } from './components/registro/registrousuario';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { Clases } from './components/clases/clases';

import { GuiaUsuario } from './components/guia-usuario/guia-usuario';

import { Vuelos } from './components/vuelos/vuelos';
import { RegistroPiloto } from './components/registro-piloto/registro-piloto';
import { RegistroVuelo } from './components/registro-vuelo/registro-vuelo';
import { Aeropuertos } from './components/aeropuertos/aeropuertos';
import { AuthService } from './services/auth';

const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() || inject(Router).parseUrl('/Login');
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'Login', component: Login },
  { path: 'Registro', component: Register },
  { path: 'guia-usuario', component: GuiaUsuario },
  { path: 'RecuperarContrasena', component: ForgotPassword },
  { path: 'Dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'Clases', component: Clases },
  { path: 'Vuelos', component: Vuelos, canActivate: [authGuard] },
  { path: 'Aeropuertos', component: Aeropuertos, canActivate: [authGuard] },
  { path: 'Pilotos', component: RegistroPiloto, canActivate: [authGuard] },
  { path: 'RegistroVuelo', component: RegistroVuelo, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
