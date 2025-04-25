import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector : 'exam-app',
  template : `<router-outlet></router-outlet>`,
  // template: '<modules></modules>',
  encapsulation : ViewEncapsulation.None
})
export class AppComponent {}
