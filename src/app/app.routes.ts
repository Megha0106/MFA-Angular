import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'register',
        title: 'Create account',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'login',
        title: 'Sign in',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/portal-layout/portal-layout').then((m) => m.PortalLayout),
    children: [
      {
        path: 'dashboard',
        // Allows navigation only if a user is signed in; otherwise starts the Microsoft login.
        // Client-side only: it protects the UI, not data (a backend must validate tokens itself).
        canActivate: [MsalGuard],
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
