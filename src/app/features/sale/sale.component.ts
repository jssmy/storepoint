import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SaleProductCardComponent } from '../../shared/components/sale-product-card/sale-product-card.component';
import { CartDrawerComponent } from '../../shared/components/cart-drawer/cart-drawer.component';
import {
  CartItem,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  MOCK_PRODUCTS,
  Product,
  ProductCategory,
} from '../products/products.data';

@Component({
  selector: 'stp-sale',
  imports: [DecimalPipe, FormsModule, ButtonComponent, SaleProductCardComponent, CartDrawerComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss',
})
export class SaleComponent implements AfterViewInit, OnDestroy {
  private readonly saleHeader = viewChild<ElementRef>('saleHeader');
  protected readonly isStuck = signal(false);
  private stickyObserver?: IntersectionObserver;

  // ── Search & filter ──────────────────────────────────────
  protected readonly categories: ProductCategory[] = [
    'todos', 'abarrotes', 'bebidas', 'lacteos',
    'snacks', 'limpieza', 'higiene', 'panaderia', 'carnes',
  ];

  protected readonly categoryLabels = CATEGORY_LABELS;

  protected readonly searchQuery = signal('');
  protected readonly activeCategory = signal<ProductCategory>('todos');
  protected readonly hasSearched = signal(false);

  // ── Quantity per product (before adding to cart) ─────────
  protected readonly quantities = signal<Map<number, number>>(new Map());

  // ── Cart ─────────────────────────────────────────────────
  protected readonly cartItems = signal<CartItem[]>([]);
  protected readonly showCartDrawer = signal(false);

  // ── Swipe tracking ───────────────────────────────────────
  private touchStartX = 0;

  // ── Derived ──────────────────────────────────────────────
  protected readonly filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.activeCategory();

    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = category === 'todos' || product.category === category;
      const matchesQuery = !query || product.name.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  });

  protected readonly cartTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  protected readonly cartCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0),
  );

  // ── Search handlers ──────────────────────────────────────
  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    if (value.trim().length > 0) this.hasSearched.set(true);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.hasSearched.set(false);
  }

  protected setCategory(category: ProductCategory): void {
    this.activeCategory.set(category);
    if (!this.hasSearched()) this.hasSearched.set(true);
  }

  // ── Category icon helper ─────────────────────────────────
  protected categoryIcon(cat: ProductCategory): string {
    return CATEGORY_ICONS[cat];
  }

  // ── Quantity helpers ─────────────────────────────────────
  protected getQty(productId: number): number {
    return this.quantities().get(productId) ?? 1;
  }

  protected setQty(productId: number, value: number): void {
    const clamped = Math.max(1, value);
    this.quantities.update(map => {
      const next = new Map(map);
      next.set(productId, clamped);
      return next;
    });
  }

  protected incrementQty(productId: number): void {
    this.setQty(productId, this.getQty(productId) + 1);
  }

  protected decrementQty(productId: number): void {
    this.setQty(productId, this.getQty(productId) - 1);
  }

  // ── Swipe gesture handlers ───────────────────────────────
  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  protected onTouchEnd(event: TouchEvent, productId: number): void {
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    if (delta > 50) {
      this.incrementQty(productId);
    } else if (delta < -50) {
      this.decrementQty(productId);
    }
  }

  // ── Cart handlers ─────────────────────────────────────────
  protected isInCart(productId: number): boolean {
    return this.cartItems().some(i => i.product.id === productId);
  }

  protected addToCart(product: Product): void {
    const qty = this.getQty(product.id);
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }
      return [...items, { product, quantity: qty }];
    });
    // Reset quantity for this product after adding
    this.setQty(product.id, 1);
  }

  protected removeFromCart(productId: number): void {
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
  }

  protected updateCartQty(productId: number, qty: number): void {
    const clamped = Math.max(1, qty);
    this.cartItems.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity: clamped } : i),
    );
  }

  protected openCart(): void {
    this.showCartDrawer.set(true);
  }

  protected closeCart(): void {
    this.showCartDrawer.set(false);
  }

  protected clearCart(): void {
    this.cartItems.set([]);
    this.showCartDrawer.set(false);
  }

  protected confirmSale(): void {
    // TODO: connect to backend
    this.cartItems.set([]);
    this.showCartDrawer.set(false);
  }

  // ── Sticky observer ───────────────────────────────────────
  ngAfterViewInit(): void {
    const el = this.saleHeader()?.nativeElement;
    if (!el) return;
    this.stickyObserver = new IntersectionObserver(
      ([entry]) => this.isStuck.set(!entry.isIntersecting),
      { threshold: 0 },
    );
    this.stickyObserver.observe(el);
  }

  ngOnDestroy(): void {
    this.stickyObserver?.disconnect();
  }
}
