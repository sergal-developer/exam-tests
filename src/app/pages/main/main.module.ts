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
import { AdminComponent } from './components/admin/admin.component';
import { MainServices } from './main.service';
import { SettingsComponent } from './components/settings/settings.component';
import { CommonServices } from 'src/app/shared/services/common.services';

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
    AdminComponent,
    SettingsComponent
  ],
  exports: [
    MainComponent,
    SplashComponent,
    DashboardComponent,
    ExamComponent,
    CreateComponent,
    AdminComponent,
    SettingsComponent
  ],
  providers: [EventBusService, MainServices, CommonServices],
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
