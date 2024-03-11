import {
  Component, OnInit, ViewEncapsulation,
} from '@angular/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';


@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  screen: ScreenEnum = ScreenEnum.splash;
  data: any;

  constructor(private eventService: EventBusService) { }

  ngOnInit() {
    
  }
}
