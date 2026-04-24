import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'stp-icon',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'iconClass()',
    'aria-hidden': 'true',
  },
  styles: [`
    :host {
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
      flex-shrink: 0;
      font-style: normal;
    }
  `],
})
export class IconComponent {
  readonly name = input.required<string>();

  private readonly themeService = inject(ThemeService);

  protected readonly iconClass = computed(() =>
    this.themeService.theme() === 'dark'
      ? `ph-fill ph-${this.name()}`
      : `ph ph-${this.name()}`
  );
}
