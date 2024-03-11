import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { QuizComponent } from './components/quiz/quiz.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    QuizComponent
  ],
  exports: [
    MainComponent,
    QuizComponent
  ],
  providers: [EventBusService],
})
export class MainModule {}
