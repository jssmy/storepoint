import { Component, computed, signal } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'stp-profile',
  imports: [InputComponent, ButtonComponent, IconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  // TODO: populate from AuthService when available
  protected readonly name = signal('Joset');
  protected readonly email = signal('');
  protected readonly phone = signal('');
  protected readonly avatarUrl = signal<string | null>(null);

  protected readonly currentPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');

  protected readonly userInitial = computed(() =>
    this.name().charAt(0).toUpperCase()
  );

  protected onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.avatarUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  protected saveProfile(): void {
    // TODO: call ProfileService when backend is ready
  }

  protected savePassword(): void {
    // TODO: call ProfileService when backend is ready
  }
}
