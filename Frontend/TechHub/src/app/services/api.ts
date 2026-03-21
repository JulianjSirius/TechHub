import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { Login } from '../models/login';
import { RegistroUsuario } from '../models/registrousuario';
import { Usuario } from '../models/usuario';
import { Clase } from '../models/clases'; // ✅ Agregada la importación

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5297/api';

  constructor() {}

  registerUser(usuario: RegistroUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios/registro`, usuario);
  }

  login(credenciales: Login): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios/login`, credenciales);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }


  getClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(`${this.apiUrl}/clases`);
  }

  agendarClase(datosReserva: { usuarioId: number; claseId: number }) {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/clases/agendar`, datosReserva);
  }

 
  crearMantenimiento(datosMantenimiento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mantenimientos`, datosMantenimiento);
  }
}