import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: 'notices' | 'products' | 'caja' | 'dashboard';
}

@Component({
  selector: 'stp-bottom-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss',
})
export class BottomBarComponent {
  protected readonly navItems: NavItem[] = [
    { label: 'Noticias',   route: '/notices',   icon: 'notices'   },
    { label: 'Productos',  route: '/products',  icon: 'products'  },
    { label: 'Caja',       route: '/caja',      icon: 'caja'      },
    { label: 'Dashboard',  route: '/dashboard', icon: 'dashboard' },
  ];
}
