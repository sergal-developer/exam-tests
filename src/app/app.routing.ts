import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/notFound/notFound.component';
import { MainPackage } from './pages/main/main.module';


const appRoutes: Routes = [
  ...MainPackage.routes,
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutes { }
