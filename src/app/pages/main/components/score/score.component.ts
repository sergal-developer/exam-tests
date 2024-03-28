import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'score',
  templateUrl: './score.html',
  styleUrls: ['./score.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScoreComponent implements OnInit {
  service = new ProfileService();

  constructor(private eventService: EventBusService) { }

  ngOnInit() {
    this.checkData();
  }

  async checkData() {
  }
}
