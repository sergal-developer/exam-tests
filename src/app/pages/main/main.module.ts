import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SplashComponent } from './components/splash/splash.component';
import { ExamComponent } from './components/exam/exam.component';
import { CreateComponent } from './components/create/create.component';
import { ModulePackage } from 'src/app/shared/data/interfaces/interfaces';
import { UploadComponent } from './components/upload/upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,

    RouterModule.forChild([
      {
        path: 'dashboard',
        component: MainComponent,
      },
    ]),
    // Layout Components
  ],
  declarations: [
    MainComponent,
    SplashComponent,
    DashboardComponent,
    ExamComponent,
    CreateComponent,
    UploadComponent
  ],
  exports: [
    MainComponent,
    SplashComponent,
    DashboardComponent,
    ExamComponent,
    CreateComponent,
    UploadComponent
  ],
  providers: [EventBusService],
})
export class MainModule {}

export let MainPackage: ModulePackage = {
  modules: [ MainModule ],
  routes: [
    { path: '', component: SplashComponent },
    { path: 'dashboard', component: MainComponent },
    { path: 'dashboard/:module', component: MainComponent },
    { path: 'dashboard/:module/:action', component: MainComponent },
  ]
};
