import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { UiServices } from '../shared/services/ui.services';
import { CommonServices } from '../shared/services/common.services';

@Component({
  selector: 'modules',
  templateUrl: './modules.html',
  encapsulation: ViewEncapsulation.None,
})
export class ModuleComponent implements OnInit {
  availableLangs = ['es', 'en'];
  browserLangs: string[] = [];
  currentLang = '';

  _screen = ScreenEnum;
  screen: ScreenEnum;

  module: string;
  submodule: string;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _uiServices: UiServices,
    private _commonServicecs: CommonServices,
    private translate: TranslateService) {

    this.setupLanguage();

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.module = this._activatedRoute.snapshot.paramMap.get('module');
        if (this.module) {
          this.screen = this._screen[this.module];
        }

        this.submodule = this._activatedRoute.snapshot.paramMap.get('submodule');
      }
    });
  }

  ngOnInit() {
  }

  async setupLanguage() {
    const settings = await this._commonServicecs.getAllSettings();
    console.log('settings: ', settings);
    if(settings) {
      
      const setting = settings[0];

      const languages = [];
      setting.availableLanguages.map((lan) => {
        languages.push(lan.value);
      })
      this.translate.addLangs(languages);
      this.translate.setDefaultLang(setting.language);
    } else {
      this.translate.addLangs(this.availableLangs);
      this.currentLang = 'es';
      this.translate.setDefaultLang(this.currentLang);
    }
  }
}
