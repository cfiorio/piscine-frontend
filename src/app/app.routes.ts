import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'festivals',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/festivals/festivals').then((m) => m.Festivals),
  },
  {
    path: '**',
    redirectTo: '',
  },
];