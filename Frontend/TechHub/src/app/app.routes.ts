import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';

import { Register } from './components/registro/registrousuario';
import { ForgotPassword } from './components/forgot-password/forgot-password';

import { GuiaUsuario } from './components/guia-usuario/guia-usuario';

import { Vuelos } from './components/vuelos/vuelos';
import { Aeropuertos } from './components/aeropuertos/aeropuertos';
import { AuthService } from './services/auth';

const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() || inject(Router).parseUrl('/Login');
};

const pilotoGuard = () => {
  const auth = inject(AuthService);
  if (!auth.isLoggedIn()) return inject(Router).parseUrl('/Login');
  if (auth.isPiloto()) return true;
  return inject(Router).parseUrl('/Dashboard');
};

const pasajeroGuard = () => {
  const auth = inject(AuthService);
  if (!auth.isLoggedIn()) return inject(Router).parseUrl('/Login');
  if (auth.isPasajero()) return true;
  return inject(Router).parseUrl('/Dashboard');
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'Login', component: Login },
  { path: 'Registro', component: Register },
  { path: 'guia-usuario', component: GuiaUsuario },
  { path: 'RecuperarContrasena', component: ForgotPassword },
  { path: 'Dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'Vuelos', component: Vuelos, canActivate: [authGuard] },
  { path: 'Aeropuertos', component: Aeropuertos, canActivate: [authGuard] },
  {
    path: 'Pilotos',
    loadComponent: () =>
      import('./components/piloto/registro-piloto/registro-piloto').then((m) => m.RegistroPiloto),
    canActivate: [pilotoGuard],
  },
  {
    path: 'RegistroVuelo',
    loadComponent: () =>
      import('./components/piloto/registro-vuelo/registro-vuelo').then((m) => m.RegistroVuelo),
    canActivate: [pilotoGuard],
  },
  {
    path: 'Practicas',
    loadComponent: () =>
      import('./components/pasajero/practicas/practicas').then((m) => m.PracticasComponent),
    canActivate: [pasajeroGuard],
  },
  {
    path: 'HorasVuelo',
    loadComponent: () =>
      import('./components/piloto/horas-vuelo/horas-vuelo').then((m) => m.HorasVueloComponent),
    canActivate: [pilotoGuard],
  },
  { path: '**', redirectTo: 'login' },
];
