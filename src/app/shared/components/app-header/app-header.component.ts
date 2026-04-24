import { Component, inject, input, output } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'stp-app-header',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  readonly userName = input<string>('');
  readonly menuToggle = output<void>();

  protected readonly config = inject(AppConfigService);
  protected readonly themeService = inject(ThemeService);

  protected userInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
