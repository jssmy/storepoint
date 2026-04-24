import { Component, computed, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';

export type PaymentMethod = 'cash' | 'credit';
export type PaymentFrequency = 'semanal' | 'quincenal' | 'mensual';

export interface CashPaymentData {
  method: 'cash';
  efectivo: number;
  digital: number;
}

export interface CreditPaymentData {
  method: 'credit';
  initialAmount: number;
  installments: number;
  frequency: PaymentFrequency;
}

export type PaymentData = CashPaymentData | CreditPaymentData;

@Component({
  selector: 'stp-payment-step',
  imports: [DecimalPipe, ButtonComponent],
  templateUrl: './payment-step.component.html',
  styleUrl: './payment-step.component.scss',
})
export class PaymentStepComponent {
  readonly total = input.required<number>();

  readonly back = output<void>();
  readonly confirm = output<PaymentData>();

  protected readonly paymentMethod = signal<PaymentMethod | null>(null);

  protected readonly efectivo = signal<number>(0);
  protected readonly digital = signal<number>(0);
  protected readonly totalPaid = computed(() => this.efectivo() + this.digital());
  protected readonly change = computed(() => Math.max(0, this.totalPaid() - this.total()));
  protected readonly remaining = computed(() => Math.max(0, this.total() - this.totalPaid()));

  protected readonly initialAmount = signal<number>(0);
  protected readonly installments = signal<number>(1);
  protected readonly frequency = signal<PaymentFrequency>('mensual');
  protected readonly financed = computed(() => Math.max(0, this.total() - this.initialAmount()));
  protected readonly installmentAmount = computed(() => {
    const count = this.installments();
    return count > 0 ? this.financed() / count : 0;
  });

  protected readonly FREQUENCIES: { value: PaymentFrequency; label: string }[] = [
    { value: 'semanal', label: 'Semanal' },
    { value: 'quincenal', label: 'Quincenal' },
    { value: 'mensual', label: 'Mensual' },
  ];
  protected readonly INSTALLMENT_OPTIONS = [1, 2, 3, 4, 6, 8, 12];

  protected readonly canConfirm = computed(() => {
    const method = this.paymentMethod();
    if (!method) return false;
    if (method === 'cash') return this.totalPaid() >= this.total() - 0.001;
    return true;
  });

  protected selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod.set(method);
    if (method === 'cash' && this.efectivo() === 0 && this.digital() === 0) {
      this.efectivo.set(this.total());
    }
  }

  protected onEfectivoInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.efectivo.set(isNaN(val) ? 0 : Math.max(0, val));
  }

  protected onDigitalInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.digital.set(isNaN(val) ? 0 : Math.max(0, val));
  }

  protected onInitialAmountInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.initialAmount.set(isNaN(val) ? 0 : Math.max(0, Math.min(val, this.total())));
  }

  protected confirmPayment(): void {
    const method = this.paymentMethod();
    if (!method || !this.canConfirm()) return;

    const payment: PaymentData = method === 'cash'
      ? { method: 'cash', efectivo: this.efectivo(), digital: this.digital() }
      : { method: 'credit', initialAmount: this.initialAmount(), installments: this.installments(), frequency: this.frequency() };

    this.confirm.emit(payment);
  }
}
