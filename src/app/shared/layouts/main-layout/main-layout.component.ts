import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { BottomBarComponent } from '../../components/bottom-bar/bottom-bar.component';

@Component({
  selector: 'stp-main-layout',
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent, BottomBarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  // TODO: replace with real auth user from AuthService
  protected readonly currentUserName = 'Joset';
}
