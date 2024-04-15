import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { MainServices } from './main.service';

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

  header: any = null;
  subheader: any = null;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private eventService: EventBusService,
    public _mainServices: MainServices) { }

  ngOnInit() {
    this.header = null;

    this._activatedRoute.params.subscribe((params: any) => {
      console.log('params: ', params);
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
    });

    this.eventService.on(EVENTS.CONFIG, async (response) => {
      if(!response) { return; }
      if (response.component === 'header') {
        const profile = response.value;
        const data = {
          title: profile.userName,
          image: profile.avatar ? profile.avatar.url : null
        }
        this.updateHeader(data);
      }

      if (response.component === 'subheader') {
        const data = {
          title: response.value.title,
          questions: response.value.questions,
          color: response.value.color,
          current: response.value.current,
          progress: response.value.progress,
          completed: response.value.completed,
          canEditTitle: response.value.canEditTitle,
        }
        this.updateSubHeader(data);
      }

      if (response.component === 'reset') {
        this.subheader = null;
      }
    });

    this.eventService.on(EVENTS.SCREENS, (response) => {
      if(!response) { return; }
      this.screen = response.value;

      if(response.data) {
        this.data = response.data;
      }
    });
  }

  async updateHeader(data: any) {
    setTimeout(() => {
      this.header = {...data};
      console.log('this.header: ', this.header);
    }, 200);
  }

  async updateSubHeader(data: any) {
    setTimeout(() => {
      this.subheader = {...data};
      console.log('this.subheader: ', this.subheader);
    }, 200);
  }

  returnHome() {
    this.subheader = null;
    this.screen = ScreenEnum.dashboard;
    this._router.navigate( [`/dashboard`]);
  }

  examTitle = '';
  editExamTitle(title: string) {
    this.examTitle = title;
  }
}
