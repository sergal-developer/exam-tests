import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from 'src/app/shared/services/common.services';

@Component({
  selector: 'splash',
  templateUrl: './splash.html',
  encapsulation: ViewEncapsulation.None,
})
export class SplashComponent implements OnInit {
  timeDelay = 1500;
  state = 'enter'

  constructor(private _commonServices: CommonServices) { }

  ngOnInit() {
    // this.launcSplash();
    this.checkInit();
  }

  async checkInit() {
    const profile = await this._commonServices.getActiveProfile();
    console.log('profile: ', profile);
    const module = !profile ? ScreenEnum.register : ScreenEnum.dashboard;
    setTimeout(() => {
      this._commonServices.navigate(module);
    }, this.timeDelay);
  }
}
