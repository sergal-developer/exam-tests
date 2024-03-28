import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { QuizComponent } from './components/quiz/quiz.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScoreComponent } from './components/score/score.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SplashComponent } from './components/splash/splash.component';
import { ExamComponent } from './components/exam/exam.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
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

    ScoreComponent,
    QuizComponent
  ],
  exports: [
    MainComponent,
    SplashComponent,
    DashboardComponent,
    ExamComponent,

    ScoreComponent,
    QuizComponent
  ],
  providers: [EventBusService],
})
export class MainModule {}
