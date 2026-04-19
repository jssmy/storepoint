import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppConfigService } from '../../../core/services/app-config.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'stp-login',
  imports: [ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly themeService = inject(ThemeService);
  protected readonly config = inject(AppConfigService);
  protected readonly loadingService = inject(LoadingService);

  protected readonly submitAttempted = signal(false);
  protected readonly currentYear = new Date().getFullYear();

  protected readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  protected async onSubmit(): Promise<void> {
    this.submitAttempted.set(true);
    if (this.form.invalid) return;

    this.loadingService.start();
    try {
      // TODO: connect to auth service
      await new Promise(r => setTimeout(r, 1000)); // placeholder
      this.router.navigate(['/notices']);
    } finally {
      this.loadingService.finish();
    }
  }

  protected get identifierCtrl() {
    return this.form.controls.identifier;
  }

  protected get passwordCtrl() {
    return this.form.controls.password;
  }
}
