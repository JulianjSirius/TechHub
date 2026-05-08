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

  private readonly pageSize = 8;

  loading = signal(false);
  error = signal('');
  productos = signal<Producto[]>([]);
  searchTerm = signal('');
  pageIndex = signal(0);
  filteredProductos = computed(() => {
    const term = this.normalizeTerm(this.searchTerm());
    if (!term) return this.productos();

    return this.productos().filter((producto) => {
      const haystack = this.normalizeTerm(
        `${producto.nombre} ${producto.descripcion ?? ''} ${producto.marca ?? ''}`,
      );
      return haystack.includes(term);
    });
  });
  visibleProductos = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredProductos().slice(start, start + this.pageSize);
  });
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProductos().length / this.pageSize)),
  );
  pageNumbers = computed(() => {
    const total = this.totalPages();
    if (total <= 1) return [];

    const current = this.pageIndex();
    const maxButtons = 5;
    let start = Math.max(0, current - Math.floor(maxButtons / 2));
    let end = Math.min(total - 1, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(0, end - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
  hasPrev = computed(() => this.pageIndex() > 0);
  hasNext = computed(() => this.pageIndex() + 1 < this.totalPages());
  skeletons = Array.from({ length: 6 });

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
        this.pageIndex.set(0);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron cargar los productos. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  setPage(index: number) {
    if (index < 0 || index >= this.totalPages()) return;
    this.pageIndex.set(index);
  }

  nextPage() {
    if (this.hasNext()) {
      this.pageIndex.update((current) => current + 1);
    }
  }

  prevPage() {
    if (this.hasPrev()) {
      this.pageIndex.update((current) => current - 1);
    }
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

  private normalizeTerm(value: string) {
    return value.toLowerCase().trim();
  }
}
