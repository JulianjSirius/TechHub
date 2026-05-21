import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Productos } from './components/productos/productos';
import { Register } from './components/registro/registrousuario';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { Clases } from './components/clases/clases';
import { Servicios } from './components/servicios/servicios';
import { GuiaUsuario } from './components/guia-usuario/guia-usuario';
import { Mantenimiento } from './components/mantenimiento/mantenimiento';
import { Opciones } from './components/opciones/opciones';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'Login', component: Login },
  { path: 'Registro', component: Register },
  { path: 'guia-usuario', component: GuiaUsuario },
  { path: 'RecuperarContrasena', component: ForgotPassword },
  { path: 'Dashboard', component: Dashboard },
  { path: 'Productos', component: Productos },
  { path: 'Clases', component: Clases },
  { path: 'servicios', component: Servicios },
  { path: 'opciones', component: Opciones },
  { path: 'mantenimiento', component: Mantenimiento },
  { path: '**', redirectTo: 'login' },
];
