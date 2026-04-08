import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'jeux',
    loadComponent: () => import('./pages/jeux/jeux').then((m) => m.Jeux),
  },
  {
    path: 'jeux-editeur',
    loadComponent: () => import('./pages/jeux-editeur/jeux-editeur').then((m) => m.JeuxEditeur),
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