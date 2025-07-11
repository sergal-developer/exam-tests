import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from '../shared/services/common.services';
import { UiServices } from '../shared/services/ui.services';
import { SettingsEntity, ThemeProps } from '../shared/data/entities/entities';

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

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _uiServices: UiServices,
    private _commonServices: CommonServices,
    private translate: TranslateService) {

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
    // this._commonServices.clearDB();
    this.getPropsScreen();
    await this._commonServices.checkFiles();
    this.setupLanguage();
  }

  async ngAfterViewInit() {
  }

  async setupLanguage() {
    const settings = await this._commonServices.getAllSettings();
    if (settings) {
      const setting: SettingsEntity = settings[0];
      const languages = [];
      setting.availableLanguages.map((lan) => {
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

  applyCurrentTheme(settings: SettingsEntity | any) {
    settings.themeProps.dark.zoomLevel = '100%';
    settings.themeProps.light.zoomLevel = '100%';
    const theme = settings.themeProps[settings.theme.toLowerCase()];
    this._uiServices.applyTheme(theme);
  }

  async getLogs() {
    const logs = await this._commonServices.getAllLogs();
    console.log('logs: ', logs);
  }

  screenwidth = 0;
  screenheight = 0;

  getPropsScreen() {
    this.screenwidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    this.screenheight = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
  }
}
