import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import {
    CartItem,
    CATEGORY_ICONS,
    ProductCategory,
} from '../../../features/products/products.data';
import { ButtonComponent } from '../button/button.component';
import { InputNumericComponent } from '../input-numeric/input-numeric.component';

@Component({
    selector: 'stp-cart-item',
    imports: [DecimalPipe, InputNumericComponent, ButtonComponent],
    templateUrl: './cart-item.component.html',
    styleUrl: './cart-item.component.scss',
    host: { class: 'cart-item' },
})
export class CartItemComponent {
    readonly item = input.required<CartItem>();

    readonly quantityChange = output<number>();
    readonly remove = output<void>();

    protected readonly subtotal = computed(
        () => this.item().product.price * this.item().quantity,
    );

    protected categoryIcon(cat: ProductCategory): string {
        return CATEGORY_ICONS[cat];
    }
}
