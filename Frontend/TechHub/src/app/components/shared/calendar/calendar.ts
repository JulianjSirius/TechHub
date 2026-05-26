import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';

interface CalendarEvent {
  date: Date;
  title: string;
  type: 'vuelo' | 'practica' | 'clase';
  color: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class CalendarComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  currentMonth = signal(new Date());
  selectedDay = signal<Date | null>(null);
  events = signal<CalendarEvent[]>([]);
  loading = signal(false);

  readonly weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  readonly monthYear = computed(() => {
    const d = this.currentMonth();
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  readonly daysInMonth = computed(() => {
    const year = this.currentMonth().getFullYear();
    const month = this.currentMonth().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  });

  readonly dayEvents = computed(() => {
    const day = this.selectedDay();
    if (!day) return [];
    return this.events().filter(e => 
      e.date.getDate() === day.getDate() &&
      e.date.getMonth() === day.getMonth() &&
      e.date.getFullYear() === day.getFullYear()
    );
  });

  readonly isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  readonly hasEvents = (date: Date) => {
    return this.events().some(e =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  };

  readonly getEventColor = (date: Date) => {
    const ev = this.events().find(e =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
    return ev?.color;
  };

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);
    
    this.api.getVuelos().subscribe({
      next: (vuelos) => {
        const eventList: CalendarEvent[] = [];
        
        vuelos.forEach(v => {
          const d = new Date(v.fechaSalida);
          eventList.push({
            date: d,
            title: `${v.origen} → ${v.destino}`,
            type: 'vuelo',
            color: '#f59e0b',
          });
        });

        const userId = this.auth.user();
        if (userId) {
          const uid = typeof userId.id === 'number' ? userId.id : Number(userId.id);
          this.api.getPracticas(uid).subscribe({
            next: (practicas) => {
              practicas.forEach(p => {
                eventList.push({
                  date: new Date(p.fecha),
                  title: `${p.tipo}: ${p.descripcion || 'Práctica'}`,
                  type: 'practica',
                  color: '#3b82f6',
                });
              });
              this.events.set(eventList);
              this.loading.set(false);
            },
            error: () => {
              this.events.set(eventList);
              this.loading.set(false);
            }
          });
        } else {
          this.events.set(eventList);
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  prevMonth() {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectDay(day: Date) {
    this.selectedDay.set(day);
  }
}
