export const AppRoutes = {
  login:     'login',
  dashboard: 'dashboard',
  notices:   'notices',
  products:  'products',
  sale:      'sale',
  caja:      'caja',
  profile:   'profile',
  suppliers: 'suppliers',
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];
