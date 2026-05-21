import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario';

type AuthUser = Pick<Usuario, 'id' | 'nombre' | 'correo' | 'direccion'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'techhub.user';
  private readonly userSignal = signal<AuthUser | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => Boolean(this.userSignal()));
  readonly userName = computed(() => this.userSignal()?.nombre ?? 'Usuario');
  readonly userAddress = computed(() => this.userSignal()?.direccion ?? '');

  constructor() {
    this.loadFromStorage();
  }

  setUser(user: Usuario) {
    const safeUser: AuthUser = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      direccion: user.direccion,
    };

    this.userSignal.set(safeUser);
    this.persist();

    if (user.id !== undefined && user.id !== null) {
      localStorage.setItem('usuarioId', String(user.id));
    }
  }

  clear() {
    this.userSignal.set(null);
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('usuarioId');
  }

  updateProfile(data: Partial<AuthUser>) {
    this.userSignal.update((current) => (current ? { ...current, ...data } : current));
    this.persist();
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

  private persist() {
    const current = this.userSignal();
    if (!current) return;
    localStorage.setItem(this.storageKey, JSON.stringify(current));
  }
}
