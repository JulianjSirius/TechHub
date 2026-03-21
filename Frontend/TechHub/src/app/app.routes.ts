import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Dashboard } from './component/dashboard/dashboard';
import { Productos } from './component/productos/productos';
import { Register } from './component/registro/registrousuario';
import { ForgotPassword } from './component/forgot-password/forgot-password';
import { Clases } from './component/clases/clases';
import { Servicios } from './component/servicios/servicios';
import { GuiaUsuario } from './component/guia-usuario/guia-usuario';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'Login', component: Login },
  { path: 'Registro', component: Register },
  { path: 'guia-usuario', component: GuiaUsuario },
  { path: 'RecuperarContrasena', component: ForgotPassword },
  { path: 'Dashboard', component: Dashboard },
  { path: 'Productos', component: Productos },
  { path: 'Clases', component: Clases },
  {path: 'servicios', component: Servicios},
  { path: '**', redirectTo: 'login' },
];
