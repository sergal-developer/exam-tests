import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileEntity } from 'src/app/shared/data/entities/entities';
import { CommonServices } from 'src/app/shared/services/common.services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  defaultAvatars = [
    { url: "/assets/avatar1.svg", selected: false },
    { url: "/assets/avatar2.svg", selected: false },
    { url: "/assets/avatar3.svg", selected: false },
    { url: "/assets/avatar4.svg", selected: false },
    { url: "/assets/avatar5.svg", selected: false },
    { url: "/assets/avatar6.svg", selected: false },
  ];

  constructor(private fb: FormBuilder,
    private _commonServices: CommonServices
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });
    // this.launcSplash();
    this.checkSettings();
  }

  //#region INTERNAL
  //#endregion INTERNAL
  
  //#region DATA
  //#endregion DATA

  //#region EVENTS
  //#endregion EVENTS

  //#region CONVERTERS
  //#endregion CONVERTERS

  selectAvatar(item) {
    this.defaultAvatars.map(image => {
      image.selected = image.url == item.url ? true : false;
    });

    this.form.get('image').setValue(item.url);
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
      console.log('profile: ', profile);
      this._commonServices.navigate('dashboard');
    }
  }

  async checkSettings() {
    let settings: any = await this._commonServices.getAllSettings();
    if (!settings) {
      await this._commonServices.initializData();
      settings = await this._commonServices.getAllSettings();
      console.log('settings: ', settings);
    }

    let profile: any = await this._commonServices.getActiveProfile();
    if (profile) {
      console.log('profile: ', profile);
      this._commonServices.navigate('dashboard');
    }
  }
}
