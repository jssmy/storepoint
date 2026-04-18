import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'warning'
  | 'danger'
  | 'info'
  | 'success'
  | 'surface'
  | 'surface-alt';

export type ButtonStyle = 'solid' | 'outlined' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'stp-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('default');
  readonly btnStyle = input<ButtonStyle>('solid');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  /** When set, renders an <a> tag instead of <button> */
  readonly href = input<string | null>(null);
  readonly target = input<string | null>(null);
  readonly rel = input<string | null>(null);

  protected readonly rippleActive = signal(false);
  private rippleTimer = 0;

  protected readonly isLink = computed(() => this.href() !== null);

  protected readonly hostClasses = computed(() => ({
    [`stp-btn--${this.variant()}`]: true,
    [`stp-btn--${this.btnStyle()}`]: true,
    [`stp-btn--${this.size()}`]: true,
    'stp-btn--loading': this.loading(),
    'stp-btn--disabled': this.disabled() || this.loading(),
  }));

  protected triggerRipple(): void {
    if (this.disabled() || this.loading()) return;
    clearTimeout(this.rippleTimer);
    this.rippleActive.set(false);
    requestAnimationFrame(() => {
      this.rippleActive.set(true);
      this.rippleTimer = window.setTimeout(() => this.rippleActive.set(false), 600);
    });
  }
}
