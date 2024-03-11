import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
// import { EventBusService } from 'src/app/shared/data/utils/event.services';

@Component({
  selector: 'quiz-component',
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuizComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
