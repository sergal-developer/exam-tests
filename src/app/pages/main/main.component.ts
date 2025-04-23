import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { MainServices } from './main.service';
import { IHeader } from 'src/app/shared/data/interfaces/IUI';

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  _screen = ScreenEnum;
  screen: ScreenEnum = ScreenEnum.dashboard;
  data: any;
  timeDelay = 100;
  mainState = ''

  header: IHeader = {
    type: 'profile',
    title: '',
    avatar: '',
    headerClass: '',
    mainClass: '',
    mainStyle: '',
  };

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private eventService: EventBusService,
    public _mainServices: MainServices) { }

  ngOnInit() {
    this.header = {
      type: '',
      title: '',
      avatar: '',
      headerClass: '',
      mainClass: '',
      mainStyle: '',
    };

    this._activatedRoute.params.subscribe((params: any) => {
      this.data = null;
      // Set initial module
      if (params.module) {
        this.screen = params.module;
      } else {
        this.screen = ScreenEnum.dashboard;
      }

      if (params.action) {
        this.data = {
          id: params.action
        };
      }
      
      this.animStart();
    });

    this.eventService.on(EVENTS.CONFIG, async (response) => {
      if (!response) { return; }
      if (response.component === 'header') {
        this.updateHeader(response.value);
        console.log('response.value: ', response.value);
      }
    });

  }

  async animStart() {
    this.mainState = '';
    setTimeout(() => {
      this.mainState = 'content-loaded-enter';
    }, this.timeDelay);
  }

  _updatingHeader = false;
  async updateHeader(data: IHeader) {
    if (this._updatingHeader) { return }
    this._updatingHeader = true;
    setTimeout(() => {
      this.header = data;
      this._updatingHeader = false;
    }, 200);
  }

  returnHome() {
    this.screen = ScreenEnum.dashboard;
    this._router.navigate([`/dashboard`]);
  }

  examTitle = '';
  editExamTitle(title?: string) {
    this.examTitle = title || '';
  }
}
