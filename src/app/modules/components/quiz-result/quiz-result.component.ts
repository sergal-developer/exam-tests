import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'quiz-result',
  templateUrl: './quiz-result.html',
  encapsulation: ViewEncapsulation.None,
})
export class QuizResultComponent implements OnInit {
  timeDelay = 1500;
  state = 'enter'

  constructor(private _router: Router) { }

  ngOnInit() {
    // this.launcSplash();
  }

  //#region INTERNAL
  //#endregion INTERNAL
  
  //#region DATA
  //#endregion DATA

  //#region EVENTS
  //#endregion EVENTS

  //#region CONVERTERS
  //#endregion CONVERTERS

  async launcSplash() {
    this.state = 'enter';
    setTimeout(() => {
      this.state = 'exit';
      setTimeout(() => {
        this._router.navigate( [`/dashboard`]);
      }, this.timeDelay * 1.5);
    }, this.timeDelay);
  }
}
