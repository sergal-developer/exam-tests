import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SettingsDTO, UserDTO } from 'src/app/shared/data/entities/dtos';
import { UxUtils } from 'src/app/shared/data/utils/uxUtils';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {
  //#region INTERNAL
  form: FormGroup;
  defaultAvatars = [
    { url: "/assets/avatar-1.svg", selected: false },
    { url: "/assets/avatar-2.svg", selected: false },
    { url: "/assets/avatar-3.svg", selected: false },
    { url: "/assets/avatar-4.svg", selected: false },
    { url: "/assets/avatar-5.svg", selected: false },
    { url: "/assets/avatar-6.svg", selected: false },
  ];

  translateLabels = {
    service_sucess_save: '',
    service_fail_save: '',
  };

  languages = []
  settings: SettingsDTO;

  uistate = 'init';
  uxUtils = new UxUtils();
  //#endregion INTERNAL

  constructor(private fb: FormBuilder,
    private commonServices: CommonServices,
    private uiServices: UiServices,
    private translate: TranslateService
  ) { }


  //#region LIFECYCLE
  intervalRef: any;
  async ngOnInit() {
    this.uiServices.showLoader(true);
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      legal: [false, Validators.required],
    });

    await this.uxUtils.wait(800);
    this.checkInitialSettings();
    this.uistate = '';

    this.translate.get(['service_sucess_save', 'service_fail_save']).subscribe((res) => {
      this.translateLabels = res;
    });

    this.uiServices.showLoader(false);
    this.configLanguage();
  }
  //#endregion LIFECYCLE

  //#region DATA
  async checkInitialSettings() {
    this.settings = await this.commonServices.saveDefaultData();
    if (this.settings) {
      this.languages = this.settings._languages;
    }
    const profile = await this.commonServices.getCurrentUser()
    if (profile) {
      this.commonServices.navigate('dashboard');
    }
  }

  async register() {
    const { name, image } = this.form.value;
    const id = uuidv4();
    const data: UserDTO = {
      userId: null,
      uuid: id,
      userName: name,
      age: 0,
      avatarUrl: image,
      avatarBody: '',
      current: true,
    };

    await this.commonServices.saveUser(data);

    let user = await this.commonServices.getCurrentUser();
    if (user) {
      this.uiServices.notification(this.translateLabels.service_sucess_save, { type: 'success', closeTimer: 1500 });
      this.uistate = 'exit';
      setTimeout(() => {
        this.commonServices.navigate('dashboard');
      }, 1500);
    } else {
      this.uistate = '';
      this.uiServices.notification(this.translateLabels.service_fail_save, { type: 'error', closeTimer: 1500 });
    }
  }

  validateData() {
    const invalid = this.form.valid;
    const terms = this.form.get('legal').value;
    return invalid && (invalid == terms);
  }
  //#endregion DATA

  //#region EVENTS
  selectAvatar(item) {
    this.defaultAvatars.map(image => {
      image.selected = image.url == item.url ? true : false;
    });
    this.form.get('image').setValue(item.url);
  }

  async changeLanguage(language) {
    const languages = [];
    this.settings._languages.map((lan) => {
      languages.push(lan.value);
    })
    this.translate.addLangs(languages);
    this.settings.language = language;

    this.translate.setDefaultLang(this.settings.language);
    await this.commonServices.saveSettings({
      language: this.settings.language,
      permissions: this.settings.permissions,
      theme: this.settings.theme,
      settingId: this.settings.settingId
    });
  }

  sections = {
    language: false,
    user: false,
    avatar: false,
  }

  resetSections() {
    this.sections = {
      language: false,
      user: false,
      avatar: false,
    }
  }

  async configUser() {
    this.resetSections();
    await this.uxUtils.wait(300);
    this.sections.user = true;
  }

  async configLanguage() {
    this.resetSections();
    await this.uxUtils.wait(300);
    this.sections.language = true;
  }

  async configAvatar() {
    this.resetSections();
    await this.uxUtils.wait(300);
    this.sections.avatar = true;
  }


  mouseEffeects() {
    const cards = document.querySelectorAll('._content');
    console.log('cards: ', cards);

    cards.forEach((card: any) => {
      card.addEventListener('mousemove', (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        console.log('rect: ', rect);
        const x =
          ((event.clientX - rect.left) / rect.width) * 100;
        const y =
          ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });

  }

  //#endregion EVENTS
}
