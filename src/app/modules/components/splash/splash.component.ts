import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from 'src/app/shared/services/common.services';
import { DatabaseService } from 'src/app/shared/services/database/sql.database.service';
import { UiServices } from 'src/app/shared/services/ui.services';

@Component({
  selector: 'splash',
  templateUrl: './splash.html',
  encapsulation: ViewEncapsulation.None,
})
export class SplashComponent implements OnInit {
  timeDelay = 1500;
  state = 'enter'

  constructor(private _commonServices: CommonServices,
    private services: DatabaseService,
    public _uiServices: UiServices) { }

  async ngOnInit() {
    this._uiServices.showLoader(true);
    const existStructure = await this.loadDatabaseStructure();
    this.checkInit(existStructure);
  }

  async loadDatabaseStructure() {
    const structure = await this.services.initialDatabase();
    if (!structure) {
      this._uiServices.notification("Error al establecer conexion SQL.", { type: 'error', closeTimer: 0 })
    }
    return structure ? true : false;
  }

  async checkInit(existDatabaseStructure = false) {
    let module = ScreenEnum.register;
    if (existDatabaseStructure) {
      const profile = await this._commonServices.getCurrentUser();
      module = !profile ? ScreenEnum.register : ScreenEnum.dashboard;
    }

    setTimeout(() => {
      this._commonServices.navigate(module);
    }, this.timeDelay);
    
      this._uiServices.showLoader(false);
  }
}
