import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Producto } from '../../models/producto';

interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class Productos {
  private api = inject(ApiService);

  loading = signal(false);
  error = signal('');
  productos = signal<Producto[]>([]);

  private cartItems = signal<Record<string, CartItem>>({});

  cart = computed(() => Object.values(this.cartItems()));
  total = computed(() =>
    this.cart()
      .map((item) => (item.producto.precio ?? 0) * item.cantidad)
      .reduce((sum, value) => sum + value, 0),
  );

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading.set(true);
    this.error.set('');

    this.api.getProductos().subscribe({
      next: (productos) => {
        this.productos.set(productos ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron cargar los productos. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  agregarAlCarrito(producto: Producto) {
    const key = String(producto.id);
    const current = this.cartItems()[key];

    const nextCantidad = (current?.cantidad ?? 0) + 1;

    this.cartItems.update((prev) => ({
      ...prev,
      [key]: { producto, cantidad: nextCantidad },
    }));
  }

  quitarDelCarrito(productoId: string | number) {
    const key = String(productoId);
    this.cartItems.update((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  cambiarCantidad(productoId: string | number, cantidad: number) {
    const key = String(productoId);
    const current = this.cartItems()[key];

    // si no hay ningun articulo en el carrito, no hacemos nada
    if (!current) return;

    // Si la cantidad deseada es 0 o menos, elimina el artículo.
    if (cantidad <= 0) {
      this.quitarDelCarrito(productoId);
      return;
    }

    const nuevaCantidad = Math.max(1, cantidad);
    this.cartItems.update((prev) => ({
      ...prev,
      [key]: { ...current, cantidad: nuevaCantidad },
    }));
  }

  obtenerCantidad(productoId: string | number) {
    const key = String(productoId);
    return this.cartItems()[key]?.cantidad ?? 0;
  }
}
