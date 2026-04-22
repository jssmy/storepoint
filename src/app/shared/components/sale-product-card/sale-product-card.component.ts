import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { InputNumericComponent } from '../input-numeric/input-numeric.component';
import { CATEGORY_ICONS, Product } from '../../../features/products/products.data';

@Component({
  selector: 'stp-sale-product-card',
  imports: [DecimalPipe, ButtonComponent, InputNumericComponent],
  templateUrl: './sale-product-card.component.html',
  styleUrl: './sale-product-card.component.scss',
})
export class SaleProductCardComponent {
  readonly product = input.required<Product>();
  readonly quantity = input<number>(1);
  readonly inCart = input<boolean>(false);

  readonly quantityChange = output<number | undefined>();
  readonly addToCart = output<void>();

  protected categoryIcon(): string {
    return CATEGORY_ICONS[this.product().category];
  }
}
