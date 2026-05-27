import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'skysync.user';
  private readonly userSignal = signal<Usuario | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => Boolean(this.userSignal()));
  readonly userId = computed(() => this.userSignal()?.id ?? null);
  readonly userName = computed(() => this.userSignal()?.nombre ?? 'Usuario');
  readonly userEmail = computed(() => this.userSignal()?.correo ?? '');
  readonly userRole = computed<Usuario['rol']>(() => this.userSignal()?.rol ?? 'Pasajero');
  readonly isPiloto = computed(() => this.userRole() === 'Piloto');
  readonly isPasajero = computed(() => this.userRole() === 'Pasajero');

  constructor() {
    this.loadFromStorage();
  }

  setUser(user: Usuario) {
    this.userSignal.set(user);
    this.persist();
  }

  clear() {
    this.userSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private loadFromStorage() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Usuario;
      this.userSignal.set(parsed);
    } catch {
      this.clear();
    }
  }

  private persist() {
    const current = this.userSignal();
    if (!current) return;
    localStorage.setItem(this.storageKey, JSON.stringify(current));
  }
}
