import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'information',
    loadComponent: () => import('./information/information').then((m) => m.InformationComponent),
  },
];
