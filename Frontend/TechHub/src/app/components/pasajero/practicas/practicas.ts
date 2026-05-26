import { Component, signal, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/api';
import { AuthService } from '../../../services/auth';
import { Practica } from '../../../models/practica';

@Component({
  selector: 'app-practicas',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './practicas.html',
  styleUrls: ['./practicas.css'],
})
export class PracticasComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  practicas = signal<Practica[]>([]);
  loading = signal(false);
  error = signal('');
  saving = signal(false);

  formVisible = signal(false);

  form = signal<Omit<Practica, 'id' | 'usuarioId'>>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Teorica',
    horas: 1,
    descripcion: '',
    instructor: '',
    completada: false,
  });

  ngOnInit() {
    this.loadPracticas();
  }

  get usuarioId(): number {
    const user = this.auth.user();
    if (!user) return 0;
    return typeof user.id === 'number' ? user.id : Number(user.id);
  }

  loadPracticas() {
    this.loading.set(true);
    this.error.set('');
    const uid = this.usuarioId;
    if (!uid) { this.loading.set(false); return; }

    this.api.getPracticas(uid).subscribe({
      next: (data) => {
        this.practicas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar prácticas');
        this.loading.set(false);
      },
    });
  }

  savePractica() {
    const f = this.form();
    if (!f.fecha || !f.horas) return;

    this.saving.set(true);
    this.error.set('');

    this.api.crearPractica({
      usuarioId: this.usuarioId,
      ...f,
    } as Practica).subscribe({
      next: () => {
        this.saving.set(false);
        this.formVisible.set(false);
        this.form.set({
          fecha: new Date().toISOString().split('T')[0],
          tipo: 'Teorica',
          horas: 1,
          descripcion: '',
          instructor: '',
          completada: false,
        });
        this.loadPracticas();
      },
      error: () => {
        this.error.set('Error al guardar práctica');
        this.saving.set(false);
      },
    });
  }

  toggleCompletada(p: Practica) {
    if (!p.id) return;
    this.api.actualizarPractica(p.id, { ...p, completada: !p.completada }).subscribe({
      next: () => this.loadPracticas(),
      error: () => this.error.set('Error al actualizar práctica'),
    });
  }

  deletePractica(id: number) {
    this.api.eliminarPractica(id).subscribe({
      next: () => this.loadPracticas(),
      error: () => this.error.set('Error al eliminar práctica'),
    });
  }

  get completadas(): number {
    return this.practicas().filter(p => p.completada).length;
  }

  get totalHoras(): number {
    return this.practicas().reduce((s, p) => s + p.horas, 0);
  }
}
