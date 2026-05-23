import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UserRow } from 'src/app/shared/services/database/sql.database.service';
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
      legal: [false, Validators.required],
    });

    setTimeout(() => {
      this.checkInitialSettings();
      this.uistate = '';

      this.translate.get(['service_sucess_save', 'service_fail_save']).subscribe((res) => {
        this.translateLabels = res;
      });
    }, 800);
  }

  //#region INTERNAL
  //#endregion INTERNAL

  //#region DATA
  async checkInitialSettings() {
    const settings = await this._commonServices.setDefaultData();
    const profile = await this._commonServices.getActiveUser()
    if (profile) {
      this._commonServices.navigate('dashboard');
    }
  }

  async register() {
    const { name, image } = this.form.value;
    const id = uuidv4();
    const data: UserRow = {
      userId: 0,
      uuid: id,
      userName: name,
      age: 0,
      avatarUrl: image,
      avatarBody: '',
      current: true,
    };
    console.log('registerdata: ', data);

    await this._commonServices.postUser(data);    

    let user = await this._commonServices.getCurrentUser();
    if (user) {
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
  //#endregion EVENTS
}
