import {
  AfterContentInit,
  AfterViewInit,
  Component, OnInit, ViewEncapsulation,
} from '@angular/core';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';


@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  _screen = ScreenEnum;
  screen: ScreenEnum = ScreenEnum.splash;
  data: any;

  header: any = null;
  subheader: any = null;

  constructor(private eventService: EventBusService) { }

  ngOnInit() {
    this.header = null;

    this.eventService.on(EVENTS.CONFIG, async (response) => {
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
          completed: response.value.completed
        }
        this.updateSubHeader(data);
      }

      if (response.component === 'reset') {
        this.subheader = null;
        this.screen = response.value;
      }
    });

    this.eventService.on(EVENTS.SCREENS, (response) => {
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
  }
}
