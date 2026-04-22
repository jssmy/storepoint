import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: 'notices' | 'products' | 'caja' | 'dashboard' | 'camera';
}

@Component({
  selector: 'stp-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly isOpen = input(false);
  readonly closeRequest = output<void>();

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Productos', route: '/products',  icon: 'products'  },
    { label: 'Vender',    route: '/sale',      icon: 'camera'    },
    { label: 'Caja',      route: '/caja',      icon: 'caja'      },
    { label: 'Noticias',  route: '/notices',   icon: 'notices'   },
  ];
}
