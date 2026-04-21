import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { CartItemComponent } from '../cart-item/cart-item.component';
import {
  CartItem,
} from '../../../features/products/products.data';
import { SwipeItemComponent } from '../swipe-item/swipe-item.component';

@Component({
  selector: 'stp-cart-drawer',
  imports: [DecimalPipe, ButtonComponent, CartItemComponent, SwipeItemComponent],
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

  protected updateQty(productId: number, quantity: number): void {
    this.quantityUpdated.emit({ productId, quantity });
  }
}
