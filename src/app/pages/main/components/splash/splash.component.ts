import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'splash',
  templateUrl: './splash.html',
  styleUrls: ['./splash.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SplashComponent implements OnInit {
  service = new ProfileService();
  timeDelay = 2000;
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
        
      }, this.timeDelay / 2);
    }, this.timeDelay);
    
    
  }
}
