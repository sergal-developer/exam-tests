import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector : 'exam-app',
  template : `<router-outlet></router-outlet>`,
  styleUrls : ['./app.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AppComponent {}
