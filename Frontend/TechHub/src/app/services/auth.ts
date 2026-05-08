import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario';

type AuthUser = Pick<Usuario, 'id' | 'nombre' | 'correo'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'techhub.user';
  private readonly userSignal = signal<AuthUser | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => Boolean(this.userSignal()));
  readonly userName = computed(() => this.userSignal()?.nombre ?? 'Usuario');

  constructor() {
    this.loadFromStorage();
  }

  setUser(user: Usuario) {
    const safeUser: AuthUser = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
    };

    this.userSignal.set(safeUser);
    localStorage.setItem(this.storageKey, JSON.stringify(safeUser));

    if (user.id !== undefined && user.id !== null) {
      localStorage.setItem('usuarioId', String(user.id));
    }
  }

  clear() {
    this.userSignal.set(null);
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('usuarioId');
  }

  private loadFromStorage() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as AuthUser;
      this.userSignal.set(parsed);
    } catch {
      this.userSignal.set(null);
      localStorage.removeItem(this.storageKey);
    }
  }
}
