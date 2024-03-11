import {Routes } from '@angular/router';
import { MainComponent } from './main.component';

export let MainRoutes: Routes = [
  { path: '',
    component: MainComponent,
    // children: [
    //   { path: '', component: OverviewComponent, title: 'Palabras por Minuto' },
    // ]
  }
];