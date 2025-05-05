import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonServices } from 'src/app/shared/services/common.services';
import { ComponentsModule } from '../shared/components/components.module';
import { ModulePackage } from '../shared/data/interfaces/interfaces';
import { EventBusService } from '../shared/data/utils/event.services';
import { UiServices } from '../shared/services/ui.services';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { QuizEditableComponent } from './components/quiz-editable/quiz-editable.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SplashComponent } from './components/splash/splash.component';
import { ModuleComponent } from './modules.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ComponentsModule,

    RouterModule.forChild([
      {
        path: '',
        component: ModuleComponent,
      },
    ]),
  ],
  declarations: [
    ModuleComponent,
    DashboardComponent,
    HeaderComponent,
    QuizComponent,
    QuizEditableComponent,
    RegisterComponent,
    SettingsComponent,
    SplashComponent,
  ],
  exports: [
    ModuleComponent,
    DashboardComponent,
    HeaderComponent,
    QuizComponent,
    QuizEditableComponent,
    RegisterComponent,
    SettingsComponent,
    SplashComponent,
  ],
  providers: [EventBusService, CommonServices, UiServices],
})
export class MainModule {}

export let modulePackage: ModulePackage = {
  modules: [ MainModule ],
  routes: [
    { path: '', component: SplashComponent },
    { path: ':module', component: ModuleComponent },
    { path: ':module/:submodule', component: ModuleComponent }
  ]
};
