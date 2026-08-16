import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'datasets', pathMatch: 'full' },
  {
    path: 'datasets',
    loadComponent: () =>
      import('./features/datasets/dataset-list.component').then(m => m.DatasetListComponent)
  },
  {
    path: 'modeles',
    loadComponent: () =>
      import('./features/modeles/modele-list.component').then(m => m.ModeleListComponent)
  },
  {
    path: 'experimentations',
    loadComponent: () =>
      import('./features/experimentations/experimentation-list.component').then(m => m.ExperimentationListComponent)
  },
  { path: '**', redirectTo: 'datasets' }
];
