import { Component, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { BottomBarComponent } from '../../components/bottom-bar/bottom-bar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'stp-main-layout',
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent, BottomBarComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  // TODO: replace with real auth user from AuthService
  protected readonly currentUserName = 'Joset';

  protected readonly sidebarOpen = signal(false);

  constructor() {
    // Close drawer on every navigation
    inject(Router).events.subscribe(e => {
      if (e instanceof NavigationStart) this.sidebarOpen.set(false);
    });
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
