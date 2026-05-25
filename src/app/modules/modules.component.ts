import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from '../shared/services/common.services';
import { UiServices } from '../shared/services/ui.services';
import { DatabaseService } from '../shared/services/database/sql.database.service';
import { SettingsDTO, ThemeDTO } from '../shared/data/entities/dtos';

@Component({
  selector: 'modules',
  templateUrl: './modules.html',
  encapsulation: ViewEncapsulation.None,
})
export class ModuleComponent implements OnInit, AfterViewInit {
  availableLangs = ['es', 'en'];
  browserLangs: string[] = [];
  currentLang = '';

  _screen = ScreenEnum;
  screen: ScreenEnum;

  module: string;
  submodule: string;
  uistate = '';
  uisubstate = '';
  screenwidth = 0;
  screenheight = 0;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _uiServices: UiServices,
    private _commonServices: CommonServices,
    private translate: TranslateService,
    private services: DatabaseService) {

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.module = this._activatedRoute.snapshot.paramMap.get('module');
        if (this.module) {
          this.screen = this._screen[this.module];
        }

        this.submodule = this._activatedRoute.snapshot.queryParamMap.get('action');

        setTimeout(() => {
          this.uistate = `__${this.screen}`;
          this.uisubstate = '';
        }, 500);
      }
    });
  }

  async ngOnInit() {
    await this.loadDatabaseStructure();
    this.getPropsScreen();
    this.setupLanguage();
  }

  async ngAfterViewInit() {
  }

  async loadDatabaseStructure() {
    await this.services.loadStructure();
    const structure = await this.services.getStructure();
    if(!structure) {
      this._uiServices.notification("Error al establecer conexion SQL.")
    } else {
      this._uiServices.notification("Conexion estable con base de datos.")
    }
  }

  async setupLanguage() {
    const setting = await this._commonServices.getCurrentSettings();
    if (setting) {
      const languages = [];
      setting._languages.map((lan) => {
        languages.push(lan.value);
      })
      this.translate.addLangs(languages);
      this.translate.setDefaultLang(setting.language);

      this.applyCurrentTheme(setting);
    } else {
      this.translate.addLangs(this.availableLangs);
      this.currentLang = 'es';
      this.translate.setDefaultLang(this.currentLang);
    }
  }

  onChangeUI(event) {
    this.uisubstate = event.value;
  }

  applyCurrentTheme(setting: SettingsDTO) {
    setting._themes.map((x: ThemeDTO) => x.content['zoomLevel'] = '100%');
    const theme = setting._themes.find(x => x.id == setting.theme);
    if (theme) {
      this._uiServices.applyTheme(theme);
    }
  }

  async getLogs() {
    const logs = await this._commonServices.getAllLogs();
    console.log('logs: ', logs);
  }

  getPropsScreen() {
    this.screenwidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    this.screenheight = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
  }
}
