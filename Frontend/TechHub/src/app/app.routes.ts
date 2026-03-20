import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Dashboard } from './component/dashboard/dashboard';
import { Productos } from './component/productos/productos';
import { Register } from './component/register/register';
import { ForgotPassword } from './component/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'Login', component: Login },
  { path: 'Registro', component: Register },
  { path: 'RecuperarContrasena', component: ForgotPassword },
  { path: 'Dashboard', component: Dashboard },
  { path: 'Productos', component: Productos },
  { path: '**', redirectTo: 'login' },
];