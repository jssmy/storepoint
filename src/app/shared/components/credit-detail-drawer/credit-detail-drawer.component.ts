import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { AlertComponent } from '../alert/alert.component';
import {
  Credit,
  CreditStats,
  CreditStatus,
  computeCreditStats,
  computeInstallmentRows,
} from '../../../features/credits/credits.data';
import { CreditListStepComponent } from './list-step/list-step.component';
import { CreditDetailStepComponent } from './detail-step/detail-step.component';

export interface CreditDetailData {
  customerName:  string;
  customerPhone: string;
  customerDni?:  string;
  credits:       Credit[];
}

export interface CreditDetailResult {
  customerPhone:  string;
  updatedCredits: Credit[];
}

@Component({
  selector: 'stp-credit-detail-drawer',
  imports: [DecimalPipe, ButtonComponent, IconComponent, AlertComponent, CreditListStepComponent, CreditDetailStepComponent],
  templateUrl: './credit-detail-drawer.component.html',
  styleUrl: './credit-detail-drawer.component.scss',
})
export class CreditDetailDrawerComponent {
  private readonly sheetRef =
    inject<MatBottomSheetRef<CreditDetailDrawerComponent, CreditDetailResult | null>>(MatBottomSheetRef);

  private readonly data = inject<CreditDetailData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly customerName  = this.data.customerName;
  protected readonly customerPhone = this.data.customerPhone;
  protected readonly customerDni   = this.data.customerDni;

  protected readonly credits = signal<Credit[]>(this.data.credits.map(c => ({ ...c })));
  protected readonly today = new Date();

  protected readonly selectedCreditId = signal<number | null>(
    this.data.credits.length === 1 ? this.data.credits[0].id : null,
  );

  protected readonly currentStep = computed<'list' | 'detail'>(() =>
    this.selectedCreditId() !== null ? 'detail' : 'list',
  );

  protected readonly selectedCredit = computed(() => {
    const id = this.selectedCreditId();
    return id !== null ? (this.credits().find(c => c.id === id) ?? null) : null;
  });

  protected readonly selectedStats = computed(() => {
    const c = this.selectedCredit();
    return c ? computeCreditStats(c) : null;
  });

  protected readonly selectedInstallmentRows = computed(() => {
    const c = this.selectedCredit();
    return c ? computeInstallmentRows(c, this.today) : [];
  });

  protected readonly statsMap = computed(() => {
    const map = new Map<number, CreditStats>();
    for (const c of this.credits()) {
      map.set(c.id, computeCreditStats(c));
    }
    return map;
  });

  protected readonly totalAlertCount = computed(() =>
    this.credits().filter(c => this.statsMap().get(c.id)?.hasAlert).length,
  );

  protected readonly confirmingCreditId = signal<number | null>(null);
  protected readonly paymentSuccessId   = signal<number | null>(null);

  protected stats(credit: Credit): CreditStats {
    return this.statsMap().get(credit.id)!;
  }

  protected customerInitials(): string {
    return this.customerName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  protected dominantStatus(): CreditStatus {
    const creds = this.credits();
    if (creds.some(c => c.status === 'overdue'))  return 'overdue';
    if (creds.some(c => c.status === 'active'))   return 'active';
    return 'completed';
  }

  protected formatFullDate(date: Date): string {
    const label = new Intl.DateTimeFormat('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(date);
    return label[0].toUpperCase() + label.slice(1);
  }

  protected creditId(credit: Credit): string {
    return credit.id.toString().padStart(4, '0');
  }

  protected selectCredit(id: number): void {
    this.selectedCreditId.set(id);
  }

  protected goBack(): void {
    this.selectedCreditId.set(null);
  }

  protected startPayment(creditId: number): void {
    this.confirmingCreditId.set(creditId);
  }

  protected cancelPayment(): void {
    this.confirmingCreditId.set(null);
  }

  protected confirmPayment(): void {
    const id = this.confirmingCreditId();
    if (id === null) return;

    this.credits.update(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newPaid    = c.paidInstallments + 1;
      const isComplete = newPaid >= c.installments;
      return {
        ...c,
        paidInstallments: newPaid,
        status: isComplete ? 'completed' : c.status === 'overdue' ? 'active' : c.status,
      } as Credit;
    }));

    this.confirmingCreditId.set(null);
    this.paymentSuccessId.set(id);
    setTimeout(() => this.paymentSuccessId.set(null), 2000);
  }

  protected confirmingCredit(): Credit | null {
    const id = this.confirmingCreditId();
    return id !== null ? (this.credits().find(c => c.id === id) ?? null) : null;
  }

  protected close(): void {
    this.sheetRef.dismiss({
      customerPhone:  this.customerPhone,
      updatedCredits: this.credits(),
    });
  }
}
