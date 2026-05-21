import { Injectable, computed, signal } from '@angular/core';
import { Producto } from '../models/producto';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartKey = 'techhub.cart';
  private readonly favoritesKey = 'techhub.favorites';

  private readonly cartSignal = signal<Record<string, CartItem>>({});
  private readonly favoritesSignal = signal<Record<string, Producto>>({});

  readonly cartItems = computed(() => Object.values(this.cartSignal()));
  readonly cartCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.cantidad, 0),
  );
  readonly total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.producto.precio ?? 0) * item.cantidad, 0),
  );

  readonly favorites = computed(() => Object.values(this.favoritesSignal()));
  readonly favoritesCount = computed(() => this.favorites().length);

  constructor() {
    this.loadFromStorage();
  }

  addToCart(producto: Producto) {
    const key = String(producto.id);
    const current = this.cartSignal()[key];
    const nextCantidad = (current?.cantidad ?? 0) + 1;

    this.cartSignal.update((prev) => ({
      ...prev,
      [key]: { producto, cantidad: nextCantidad },
    }));
    this.persistCart();
  }

  removeFromCart(productoId: string | number) {
    const key = String(productoId);
    this.cartSignal.update((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    this.persistCart();
  }

  setQuantity(productoId: string | number, cantidad: number) {
    const key = String(productoId);
    const current = this.cartSignal()[key];

    if (!current) return;

    if (cantidad <= 0) {
      this.removeFromCart(productoId);
      return;
    }

    const nextCantidad = Math.max(1, cantidad);
    this.cartSignal.update((prev) => ({
      ...prev,
      [key]: { ...current, cantidad: nextCantidad },
    }));
    this.persistCart();
  }

  getQuantity(productoId: string | number) {
    const key = String(productoId);
    return this.cartSignal()[key]?.cantidad ?? 0;
  }

  toggleFavorite(producto: Producto) {
    const key = String(producto.id);
    if (this.favoritesSignal()[key]) {
      this.favoritesSignal.update((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      this.persistFavorites();
      return;
    }

    this.favoritesSignal.update((prev) => ({
      ...prev,
      [key]: producto,
    }));
    this.persistFavorites();
  }

  removeFavorite(productoId: string | number) {
    const key = String(productoId);
    this.favoritesSignal.update((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    this.persistFavorites();
  }

  isFavorite(productoId: string | number) {
    const key = String(productoId);
    return Boolean(this.favoritesSignal()[key]);
  }

  private loadFromStorage() {
    const rawCart = localStorage.getItem(this.cartKey);
    if (rawCart) {
      try {
        const parsed = JSON.parse(rawCart) as Record<string, CartItem>;
        this.cartSignal.set(parsed ?? {});
      } catch {
        this.cartSignal.set({});
        localStorage.removeItem(this.cartKey);
      }
    }

    const rawFavorites = localStorage.getItem(this.favoritesKey);
    if (rawFavorites) {
      try {
        const parsed = JSON.parse(rawFavorites) as Record<string, Producto>;
        this.favoritesSignal.set(parsed ?? {});
      } catch {
        this.favoritesSignal.set({});
        localStorage.removeItem(this.favoritesKey);
      }
    }
  }

  private persistCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartSignal()));
  }

  private persistFavorites() {
    localStorage.setItem(this.favoritesKey, JSON.stringify(this.favoritesSignal()));
  }
}
