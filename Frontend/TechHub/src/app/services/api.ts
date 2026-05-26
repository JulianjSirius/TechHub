import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { RegistroUsuario } from '../models/registrousuario';
import { Clase } from '../models/clases'; // ✅ Agregada la importación
import { Usuario } from '../models/usuario';
import { Piloto } from '../models/piloto';
import { Vuelo } from '../models/vuelo';
import { Aeropuerto } from '../models/aeropuerto';

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

  actualizarPerfil(usuarioId: number, payload: { nombre: string; direccion?: string | null }) {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${usuarioId}/perfil`, payload);
  }

  cambiarContrasena(
    usuarioId: number,
    payload: { contrasenaActual: string; nuevaContrasena: string },
  ) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/usuarios/${usuarioId}/contrasena`,
      payload,
    );
  }

  recuperarContrasena(payload: { correo: string; nuevaContrasena: string }) {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/usuarios/recuperar`, payload);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  getClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(`${this.apiUrl}/clases`);
  }

  getVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.apiUrl}/vuelos`);
  }

  getAeropuertos(): Observable<Aeropuerto[]> {
    return this.http.get<Aeropuerto[]>(`${this.apiUrl}/aeropuertos`);
  }

  crearPiloto(piloto: Pick<Piloto, 'nombre' | 'licencia'>): Observable<Piloto> {
    return this.http.post<Piloto>(`${this.apiUrl}/pilotos`, piloto);
  }

  crearVuelo(vuelo: Pick<Vuelo, 'origen' | 'destino' | 'fechaSalida'>): Observable<Vuelo> {
    return this.http.post<Vuelo>(`${this.apiUrl}/vuelos`, vuelo);
  }

  agendarClase(datosReserva: { usuarioId: number; claseId: number }) {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/clases/agendar`, datosReserva);
  }

  crearMantenimiento(datosMantenimiento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mantenimientos`, datosMantenimiento);
  }
}
