import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CATEGORY_ICONS, Product } from '../../../features/products/products.data';

@Component({
  selector: 'stp-sale-product-card',
  imports: [DecimalPipe, ButtonComponent],
  templateUrl: './sale-product-card.component.html',
  styleUrl: './sale-product-card.component.scss',
})
export class SaleProductCardComponent {
  readonly product = input.required<Product>();
  readonly quantity = input<number>(1);
  readonly inCart = input<boolean>(false);

  readonly quantityChange = output<number>();
  readonly addToCart = output<void>();

  protected categoryIcon(): string {
    return CATEGORY_ICONS[this.product().category];
  }

  protected decrement(): void {
    const next = Math.max(1, this.quantity() - 1);
    this.quantityChange.emit(next);
  }

  protected increment(): void {
    const p = this.product();
    const max = p.stock > 0 ? p.stock : Infinity;
    const next = Math.min(this.quantity() + 1, max);
    this.quantityChange.emit(next);
  }

  protected onQtyInput(value: string): void {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      this.quantityChange.emit(Math.max(1, parsed));
    }
  }
}
