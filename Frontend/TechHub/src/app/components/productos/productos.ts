import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class Productos {
  private api = inject(ApiService);
  private cartService = inject(CartService);

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

  cart = this.cartService.cartItems;
  total = this.cartService.total;
  favorites = this.cartService.favorites;
  favoritesCount = this.cartService.favoritesCount;

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
    this.cartService.addToCart(producto);
  }

  quitarDelCarrito(productoId: string | number) {
    this.cartService.removeFromCart(productoId);
  }

  cambiarCantidad(productoId: string | number, cantidad: number) {
    this.cartService.setQuantity(productoId, cantidad);
  }

  obtenerCantidad(productoId: string | number) {
    return this.cartService.getQuantity(productoId);
  }

  toggleFavorito(producto: Producto) {
    this.cartService.toggleFavorite(producto);
  }

  esFavorito(productoId: string | number) {
    return this.cartService.isFavorite(productoId);
  }

  agregarFavoritoAlCarrito(producto: Producto) {
    this.cartService.addToCart(producto);
  }

  quitarFavorito(productoId: string | number) {
    this.cartService.removeFavorite(productoId);
  }

  private normalizeTerm(value: string) {
    return value.toLowerCase().trim();
  }
}
