import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

interface CalendarEvent {
  fecha: Date;
  titulo: string;
  tipo: 'vuelo' | 'practica';
  info?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  eventos = signal<CalendarEvent[]>([]);
  
  // NAVIGATION SIGNALS
  mesActual = signal<number>(new Date().getMonth());
  anoActual = signal<number>(new Date().getFullYear());
  diasDelMes = signal<number[]>([]);
  
  // NUEVA COSA: Señal para rastrear el día que se presiona
  diaSeleccionado = signal<number | null>(null);
  
  nombreMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  ngOnInit() {
    this.generarCalendario();
    this.cargarEventosSegunRol();
  }

  generarCalendario() {
    const año = this.anoActual();
    const mes = this.mesActual();
    
    const primerDiaIndex = new Date(año, mes, 1).getDay();
    const totalDias = new Date(año, mes + 1, 0).getDate();
    
    const dias = [];
    const ajusteVacio = primerDiaIndex === 0 ? 6 : primerDiaIndex - 1;
    for (let i = 0; i < ajusteVacio; i++) {
      dias.push(0);
    }
    for (let i = 1; i <= totalDias; i++) {
      dias.push(i);
    }
    this.diasDelMes.set(dias);
    this.diaSeleccionado.set(null); // Resetea la selección al cambiar de mes
  }

  // NUEVA COSA: Función para capturar el click del día
  seleccionarDia(dia: number) {
    if (dia === 0) return;
    this.diaSeleccionado.set(dia);
  }

  cargarEventosSegunRol() {
    const usuario = this.auth.user();
    if (!usuario) return;
    const uid = typeof usuario.id === 'number' ? usuario.id : Number(usuario.id);

    if (this.auth.isPiloto()) {
      this.api.getVuelos().subscribe({
        next: (vuelos) => {
          const eventosVuelo = vuelos.map((v: any) => ({
            fecha: new Date(v.fechaSalida),
            titulo: `Vuelo ${v.codigo}`,
            tipo: 'vuelo' as const,
            info: `Vuelo programado de salida`
          }));
          this.eventos.set(eventosVuelo);
        },
        error: (err) => console.error("Error al cargar vuelos para piloto:", err)
      });

    } else if (this.auth.isPasajero()) {
      this.api.getMisReservas(uid).subscribe({
        next: (reservas) => {
          const eventosReservas = reservas.map((r: any) => ({
            fecha: new Date(r.fechaReserva || r.vuelo?.fechaSalida),
            titulo: `Vuelo #${r.vueloId}`,
            tipo: 'vuelo' as const,
            info: `Reserva en estado: ${r.estado}`
          }));

          this.api.getPracticas(uid).subscribe({
            next: (practicas) => {
              const misPracticas = practicas.filter((p: any) => p.usuarioId === uid);
              const eventosPracticas = misPracticas.map((p: any) => ({
                fecha: new Date(p.fechaCreacion || p.fecha),
                titulo: `Práctica Académica`,
                tipo: 'practica' as const,
                info: `Horas registradas: ${p.cantidadHoras || p.horas}`
              }));

              this.eventos.set([...eventosReservas, ...eventosPracticas]);
            },
            error: (err) => {
              console.error("Error al cargar prácticas:", err);
              this.eventos.set(eventosReservas);
            }
          });
        },
        error: (err) => console.error("Error al cargar reservas del pasajero:", err)
      });
    }
  }

  getEventosDelDia(dia: number): CalendarEvent[] {
    if (dia === 0) return [];
    return this.eventos().filter(e => {
      const f = e.fecha;
      return f.getDate() === dia && 
             f.getMonth() === this.mesActual() && 
             f.getFullYear() === this.anoActual();
    });
  }

  cambiarMes(direccion: number) {
    let nuevoMes = this.mesActual() + direccion;
    let nuevoAno = this.anoActual();

    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAno--;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAno++;
    }

    this.mesActual.set(nuevoMes);
    this.anoActual.set(nuevoAno);
    this.generarCalendario();
  }
}