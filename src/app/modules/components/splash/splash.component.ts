import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from 'src/app/shared/services/common.services';
import { DatabaseService } from 'src/app/shared/services/database/sql.database.service';
import { UiServices } from 'src/app/shared/services/ui.services';
import { Cpu, Sparkles, Icons, icons } from "lucide";

@Component({
  selector: 'splash',
  templateUrl: './splash.html',
  encapsulation: ViewEncapsulation.None,
})
export class SplashComponent implements OnInit {
  timeDelay = 1500;
  state = 'enter'

  isMenuOpen = false;
  ico = {
    cpu: icons.Cpu,
    sparkles: icons.Sparkles
  }

  constructor(private commonServices: CommonServices,
    private databaseService: DatabaseService,
    public uiServices: UiServices) { }

  async ngOnInit() {

    this.uiServices.showLoader(true);
    const existStructure = await this.loadDatabaseStructure();
    this.checkInit(existStructure);
  }

  async loadDatabaseStructure() {
    const structure = await this.databaseService.initialDatabase();
    if (!structure) {
      this.uiServices.notification("Error al establecer conexion SQL.", { type: 'error', closeTimer: 0 })
    }
    return structure ? true : false;
  }

  async checkInit(existDatabaseStructure = false) {
    let module = ScreenEnum.register;
    if (existDatabaseStructure) {
      const profile = await this.commonServices.getCurrentUser();
      module = !profile ? ScreenEnum.register : ScreenEnum.dashboard;
    }

    setTimeout(() => {
      // this.commonServices.navigate(module);
    }, this.timeDelay);

    this.uiServices.showLoader(false);
  }
}
