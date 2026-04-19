import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: '',
        loadComponent: () =>
            import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'notices',
                loadComponent: () =>
                    import('./features/notices/notices.component').then(m => m.NoticesComponent),
            },
            {
                path: '',
                redirectTo: 'notices',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
