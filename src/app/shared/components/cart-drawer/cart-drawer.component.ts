import { Component, computed, inject, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CartItem } from '../../../features/products/products.data';
import { CartStepComponent } from './cart-step/cart-step.component';
import { PaymentStepComponent } from './payment-step/payment-step.component';
import type { PaymentData } from './payment-step/payment-step.component';

export type { PaymentData, PaymentMethod, PaymentFrequency, CashPaymentData, CreditPaymentData } from './payment-step/payment-step.component';

export interface CartBottomSheetData {
  items: CartItem[];
}

export interface CartDismissResult {
  items: CartItem[];
  confirmed: boolean;
  payment?: PaymentData;
}

@Component({
  selector: 'stp-cart-drawer',
  imports: [CartStepComponent, PaymentStepComponent],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss',
})
export class CartDrawerComponent {
  readonly swipeOptions = [
    { label: 'Eliminar', icon: 'delete', key: 'delete', stpClass: 'error-bg' },
  ];

  private readonly sheetRef = inject<MatBottomSheetRef<CartDrawerComponent, CartDismissResult | null>>(MatBottomSheetRef);
  protected readonly items = signal<CartItem[]>(inject<CartBottomSheetData>(MAT_BOTTOM_SHEET_DATA).items);
  protected readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  protected readonly step = signal<1 | 2>(1);

  protected close(): void {
    this.sheetRef.dismiss({ items: this.items(), confirmed: false });
  }

  protected updateQty(productId: number, quantity: number | undefined): void {
    if (quantity === undefined || quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(items =>
      items.map(item => item.product.id === productId ? { ...item, quantity } : item),
    );
  }

  protected removeItem(productId: number): void {
    this.items.update(items => items.filter(item => item.product.id !== productId));
  }

  protected clear(): void {
    this.sheetRef.dismiss({ items: [], confirmed: false });
  }

  protected goToPayment(): void {
    this.step.set(2);
  }

  protected goBack(): void {
    this.step.set(1);
  }

  protected confirmPayment(payment: PaymentData): void {
    this.sheetRef.dismiss({ items: this.items(), confirmed: true, payment });
  }
}
