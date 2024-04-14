import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
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
  timeDelay = 3000;

  constructor(private _router: Router,
              private eventService: EventBusService) {}

  ngOnInit() {
   this.checkData();
  }

  async checkData() {
    setTimeout(() => {
      this._router.navigate( [`/dashboard`]);
    }, this.timeDelay);
  }
}
