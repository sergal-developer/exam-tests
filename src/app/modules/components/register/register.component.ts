import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProfileEntity } from 'src/app/shared/data/entities/entities';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {

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

  uistate = 'init';

  constructor(private fb: FormBuilder,
    private _commonServices: CommonServices,
    private _uiServices: UiServices,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });

    

    setTimeout(() => {
      this.checkSettings();
      this.uistate = '';

      this.translate.get(['service_sucess_save', 'service_fail_save']).subscribe((res) => {
        this.translateLabels = res;
      });
    }, 800);

  }

  //#region INTERNAL
  //#endregion INTERNAL

  //#region DATA
  async checkSettings() {
    let settings: any = await this._commonServices.getAllSettings();
    if (!settings) {
      await this._commonServices.initializData();
      settings = await this._commonServices.getAllSettings();
    }

    let profile: any = await this._commonServices.getActiveProfile();
    if (profile) {
      this._commonServices.navigate('dashboard');
    }
  }

  async register() {
    const { name, image } = this.form.value;
    const id = uuidv4();
    const data: ProfileEntity = {
      id: id,
      userName: name,
      age: 0,
      avatar: {
        url: image
      },
      current: true,
    };

    await this._commonServices.saveProfile(data);
    let profile = await this._commonServices.getActiveProfile();
    if (profile) {
      this._uiServices.notification(this.translateLabels.service_sucess_save, { type: 'success', closeTimer: 1500 });
      this.uistate = 'exit';
      setTimeout(() => {
        this._commonServices.navigate('dashboard');
      }, 1500);
    } else {
      this.uistate = '';
      this._uiServices.notification(this.translateLabels.service_fail_save, { type: 'error', closeTimer: 1500 });
    }
  }
  //#endregion DATA

  //#region EVENTS
  selectAvatar(item) {
    this.defaultAvatars.map(image => {
      image.selected = image.url == item.url ? true : false;
    });
    this.form.get('image').setValue(item.url);
  }
  //#endregion EVENTS

  //#region CONVERTERS
  //#endregion CONVERTERS

}
