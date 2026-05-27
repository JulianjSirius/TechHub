import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { RegistroUsuario } from '../models/registrousuario';
import { Usuario } from '../models/usuario';
import { Piloto } from '../models/piloto';
import { Vuelo } from '../models/vuelo';
import { Aeropuerto } from '../models/aeropuerto';
import { Practica } from '../models/practica';
import { HorasVuelo } from '../models/horas-vuelo';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private apiUrl = '/api';

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

  getVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.apiUrl}/vuelos`);
  }

  getAeropuertos(): Observable<Aeropuerto[]> {
    return this.http.get<Aeropuerto[]>(`${this.apiUrl}/aeropuertos`);
  }
  actualizarEstadoAeropuerto(id: number, estado: string) {
    return this.http.put(`${this.apiUrl}/aeropuertos/${id}/estado`, JSON.stringify(estado), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  crearPiloto(piloto: Pick<Piloto, 'nombre' | 'licencia'>): Observable<Piloto> {
    return this.http.post<Piloto>(`${this.apiUrl}/pilotos`, piloto);
  }

  crearVuelo(vuelo: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(`${this.apiUrl}/vuelos`, vuelo);
  }

  crearMantenimiento(datosMantenimiento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mantenimientos`, datosMantenimiento);
  }

  getPracticas(usuarioId: number): Observable<Practica[]> {
    return this.http.get<Practica[]>(`${this.apiUrl}/practicas/usuario/${usuarioId}`);
  }

  crearPractica(practica: Practica): Observable<Practica> {
    return this.http.post<Practica>(`${this.apiUrl}/practicas`, practica);
  }

  actualizarPractica(id: number, practica: Practica): Observable<Practica> {
    return this.http.put<Practica>(`${this.apiUrl}/practicas/${id}`, practica);
  }

  eliminarPractica(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/practicas/${id}`);
  }

  getHorasVuelo(usuarioId: number): Observable<HorasVuelo[]> {
    return this.http.get<HorasVuelo[]>(`${this.apiUrl}/horas-vuelo/usuario/${usuarioId}`);
  }

  getAllHorasVuelo(): Observable<HorasVuelo[]> {
    return this.http.get<HorasVuelo[]>(`${this.apiUrl}/horas-vuelo`);
  }

  crearHorasVuelo(horasVuelo: HorasVuelo): Observable<HorasVuelo> {
    return this.http.post<HorasVuelo>(`${this.apiUrl}/horas-vuelo`, horasVuelo);
  }

  eliminarHorasVuelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horas-vuelo/${id}`);
  }

  // Agrega estas funciones dentro de la clase ApiService
  agendarVuelo(reserva: { usuarioId: number; vueloId: number; claseId: number; asiento: string }) {
    return this.http.post(`${this.apiUrl}/reservas`, reserva);
  }

  getMisReservas(usuarioId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/reservas/usuario/${usuarioId}`);
  }

  actualizarEstadoReserva(reservaId: number, estado: string) {
    // Aseguramos que el string viaje como formato JSON puro con stringify
    return this.http.put(`${this.apiUrl}/reservas/${reservaId}/estado`, JSON.stringify(estado), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
