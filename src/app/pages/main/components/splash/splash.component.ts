import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { EVENTS } from 'src/app/shared/data/constants/constants';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { GamesService } from 'src/app/shared/services/games.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'splash',
  templateUrl: './splash.html',
  styleUrls: ['./splash.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SplashComponent implements OnInit {
  service = new ProfileService();
  gamesService = new GamesService();

  constructor(private eventService: EventBusService) {}

  ngOnInit() {
    this.checkData();
  }

  async checkData() {

    if(!this.gamesService.getGames()) {
      this.gamesService.bulkDefaultGames();
    }

    setTimeout(() => {
      const profile = this.service.getCurrentProfile();
      
      if (!profile) {
        this.eventService.emit({ name: EVENTS.SCREEN, value: ScreenEnum.profile });
      } else {
        this.eventService.emit({ name: EVENTS.SCREEN, value: ScreenEnum.home });
      }
    }, 2500);
  }
}
