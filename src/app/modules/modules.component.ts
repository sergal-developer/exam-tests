import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from '../shared/services/ui.services';

@Component({
  selector: 'modules',
  templateUrl: './modules.html',
  styleUrls: ['./modules.scss'],
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

  data: any;
  timeDelay = 1000;
  mainState = '';

  header = {
    type: 'profile',
    title: '',
    avatar: '',
    headerClass: '',
    mainClass: '',
    mainStyle: '',
  };


  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private eventService: EventBusService,
    public _uiServices: UiServices,
    private _commonServices: CommonServices,
    private translate: TranslateService) {
    this.translate.addLangs(this.availableLangs);
    this.browserLangs = this.translate.getLangs();
    this.currentLang = 'es';
    this.translate.setDefaultLang(this.currentLang);

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.module = this._activatedRoute.snapshot.paramMap.get('module');
        if(this.module) {
           this.screen = this._screen[this.module];
        }

        this.submodule = this._activatedRoute.snapshot.paramMap.get('submodule');
        console.log('submodule: ', this.submodule);
      }
    });
  }


  ngOnInit() {
    // this.header = {
    //   type: '',
    //   title: '',
    //   avatar: '',
    //   headerClass: '',
    //   mainClass: '',
    //   mainStyle: '',
    // };

    

    // this.eventService.on(EVENTS.CONFIG, async (response) => {
    //   if (!response) { return; }
    //   if (response.component === 'header') {
    //     this.updateHeader(response.value);
    //     console.log('response.value: ', response.value);
    //   }
    // });
    // this.checkInit();
  }

  //#region INTERNAL
  //#endregion INTERNAL
  
  //#region DATA
  //#endregion DATA

  //#region EVENTS
  //#endregion EVENTS

  //#region CONVERTERS
  //#endregion CONVERTERS

  async checkProfile() {
    let profile: any = await this._commonServices.getActiveProfile();
    if(!profile) {
      this._commonServices.navigate('');
    }
    // if (!this.screen || this.screen == ScreenEnum.splash) {
      
    //   this.loading = true;
    //   const profile = await this._commonServices.getActiveProfile();
    //   console.log('profile: ', profile);

    //   if(!profile) {
    //     this.screen = ScreenEnum.register;
    //     this._commonServices.navigate('register');
    //   } else {
    //     this.screen = ScreenEnum.dashboard;
    //     this._commonServices.navigate('dashboard');
    //   }
      
      
    //   setTimeout(() => {
    //     this.loading = false;
    //   }, 1000);
    // }
  }

  _updatingHeader = false;
  async updateHeader(data: any) {
    if (this._updatingHeader) { return }
    this._updatingHeader = true;
    setTimeout(() => {
      this.header = data;
      this._updatingHeader = false;
    }, 200);
  }


  examTitle = '';
  editExamTitle(title?: string) {
    this.examTitle = title || '';
  }
}
