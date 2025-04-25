import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'splash',
  templateUrl: './splash.html',
  styleUrls: ['./splash.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SplashComponent implements OnInit {
  timeDelay = 1500;
  state = 'enter'

  constructor(private _router: Router) { }

  ngOnInit() {
    this.launcSplash();
  }

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
