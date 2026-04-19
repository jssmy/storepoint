import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { InputNumericComponent } from '../input-numeric/input-numeric.component';
import {
  CartItem,
  CATEGORY_ICONS,
  ProductCategory,
} from '../../../features/products/products.data';

@Component({
  selector: 'stp-cart-drawer',
  imports: [DecimalPipe, ButtonComponent, InputNumericComponent],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss',
})
export class CartDrawerComponent {
  readonly items = input.required<CartItem[]>();
  readonly total = input.required<number>();
  readonly count = input.required<number>();

  readonly closed = output<void>();
  readonly quantityUpdated = output<{ productId: number; quantity: number }>();
  readonly itemRemoved = output<number>();
  readonly cleared = output<void>();
  readonly confirmed = output<void>();

  protected categoryIcon(cat: ProductCategory): string {
    return CATEGORY_ICONS[cat];
  }

  protected updateQty(productId: number, quantity: number): void {
    this.quantityUpdated.emit({ productId, quantity });
  }
}
