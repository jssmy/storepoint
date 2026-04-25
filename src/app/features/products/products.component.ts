import { AfterViewInit, Component, ElementRef, OnDestroy, computed, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  MOCK_PRODUCTS,
  Product,
  ProductCategory,
} from './products.data';

interface InvNewProductForm {
  name: string;
  category: Exclude<ProductCategory, 'todos'>;
  price: number | null;
  unit: string;
}

@Component({
  selector: 'stp-products',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements AfterViewInit, OnDestroy {
  private readonly productHeader = viewChild<ElementRef>('productHeader');
  protected readonly isStuck = signal(false);
  private stickyObserver?: IntersectionObserver;

  protected readonly categories: ProductCategory[] = [
    'todos', 'abarrotes', 'bebidas', 'lacteos',
    'snacks', 'limpieza', 'higiene', 'panaderia', 'carnes',
  ];
  protected readonly categoryOptions: Exclude<ProductCategory, 'todos'>[] = [
    'abarrotes', 'bebidas', 'lacteos', 'snacks', 'limpieza', 'higiene', 'panaderia', 'carnes',
  ];
  protected readonly UNITS = [
    'unidad', 'kg', 'bolsa', 'botella', 'caja', 'paquete', 'tarro', 'barra', 'vaso', 'saco', 'cartón',
  ];
  protected readonly categoryLabels = CATEGORY_LABELS;

  // ── Main list state ──────────────────────────────────────────
  protected readonly products = signal<Product[]>([...MOCK_PRODUCTS]);
  protected readonly searchQuery = signal('');
  protected readonly activeCategory = signal<ProductCategory>('todos');

  // ── Inventory drawer state ───────────────────────────────────
  protected readonly showInventoryDrawer = signal(false);
  protected readonly invProductSearch = signal('');
  protected readonly invSelectedProduct = signal<Product | null>(null);
  protected readonly invAddingNew = signal(false);
  protected readonly invStockAdd = signal<number | null>(null);
  protected readonly invSupplier = signal('');
  protected readonly invSubmitting = signal(false);
  protected readonly invSuccess = signal(false);
  protected readonly invNewProduct = signal<InvNewProductForm>({
    name: '', category: 'abarrotes', price: null, unit: '',
  });

  // ── Computed ─────────────────────────────────────────────────
  protected readonly filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.activeCategory();
    return this.products().filter(p => {
      const matchesCategory = category === 'todos' || p.category === category;
      const matchesQuery = !query || p.name.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  });

  protected readonly isFiltered = computed(() =>
    this.searchQuery().trim().length > 0 || this.activeCategory() !== 'todos',
  );

  protected readonly invFilteredProducts = computed(() => {
    const q = this.invProductSearch().trim().toLowerCase();
    if (!q || this.invSelectedProduct()) return [];
    return this.products().filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
  });

  protected readonly canSubmitInventory = computed(() => {
    if (!this.invStockAdd() || this.invStockAdd()! <= 0) return false;
    if (!this.invSupplier().trim()) return false;
    if (this.invSelectedProduct()) return true;
    if (this.invAddingNew()) {
      const np = this.invNewProduct();
      return !!(np.name.trim() && np.price && np.price > 0 && np.unit);
    }
    return false;
  });

  // ── Inventory drawer actions ─────────────────────────────────
  protected openInventoryDrawer(prefilledName = ''): void {
    this.invProductSearch.set(prefilledName);
    this.invSelectedProduct.set(null);
    this.invStockAdd.set(null);
    this.invSupplier.set('');
    this.invSuccess.set(false);
    this.invNewProduct.set({ name: '', category: 'abarrotes', price: null, unit: '' });

    const hasMatch = prefilledName.trim()
      ? this.products().some(p => p.name.toLowerCase().includes(prefilledName.toLowerCase()))
      : false;

    this.invAddingNew.set(prefilledName.trim().length > 0 && !hasMatch);
    if (this.invAddingNew()) {
      this.invNewProduct.update(prev => ({ ...prev, name: prefilledName }));
    }
    this.showInventoryDrawer.set(true);
  }

  protected closeInventoryDrawer(): void {
    this.showInventoryDrawer.set(false);
  }

  protected onInvProductSearchInput(value: string): void {
    this.invProductSearch.set(value);
    this.invSelectedProduct.set(null);
    this.invAddingNew.set(false);
  }

  protected clearInvProductSearch(): void {
    this.invProductSearch.set('');
    this.invSelectedProduct.set(null);
    this.invAddingNew.set(false);
  }

  protected selectInvProduct(product: Product): void {
    this.invSelectedProduct.set(product);
    this.invProductSearch.set(product.name);
    this.invAddingNew.set(false);
  }

  protected switchToNewProduct(): void {
    this.invAddingNew.set(true);
    this.invNewProduct.update(prev => ({ ...prev, name: this.invProductSearch() }));
    this.invSelectedProduct.set(null);
  }

  protected patchInvNewProduct(patch: Partial<InvNewProductForm>): void {
    this.invNewProduct.update(prev => ({ ...prev, ...patch }));
  }

  protected submitInventory(): void {
    if (!this.canSubmitInventory()) return;
    this.invSubmitting.set(true);

    setTimeout(() => {
      const stockToAdd = this.invStockAdd()!;
      const supplier = this.invSupplier().trim();
      const selected = this.invSelectedProduct();

      if (selected) {
        this.products.update(prev =>
          prev.map(p => p.id === selected.id
            ? { ...p, stock: p.stock + stockToAdd, supplier }
            : p,
          ),
        );
      } else if (this.invAddingNew()) {
        const np = this.invNewProduct();
        this.products.update(prev => [
          ...prev,
          {
            id: prev.length + 1,
            name: np.name.trim(),
            category: np.category,
            price: np.price!,
            stock: stockToAdd,
            unit: np.unit,
            supplier,
          },
        ]);
      }

      this.invSubmitting.set(false);
      this.invSuccess.set(true);
      setTimeout(() => this.closeInventoryDrawer(), 1200);
    }, 600);
  }

  // ── Main search ──────────────────────────────────────────────
  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.activeCategory.set('todos');
  }

  protected setCategory(category: ProductCategory): void {
    this.activeCategory.set(category);
  }

  // ── Sticky header ────────────────────────────────────────────
  ngAfterViewInit(): void {
    const el = this.productHeader()?.nativeElement;
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

  // ── Helpers ──────────────────────────────────────────────────
  protected stockStatus(stock: number): 'ok' | 'low' | 'out' {
    if (stock === 0) return 'out';
    if (stock <= 5) return 'low';
    return 'ok';
  }

  protected categoryIcon(category: ProductCategory): string {
    return CATEGORY_ICONS[category];
  }

  protected productInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
}
