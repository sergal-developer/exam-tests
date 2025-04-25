import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileEntity, SettingsEntity } from 'src/app/shared/data/entities/entities';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';

@Component({
  selector: 'settings',
  templateUrl: './settings.html',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  profile: ProfileEntity;
  settings: SettingsEntity;
  updating = false;

  constructor(private _commonServices: CommonServices,
    private _uiServices: UiServices
  ) { }

  ngOnInit() {
    this.getSettings();
  }

  //#region DATA
  async getSettings() {
    const settings = await this._commonServices.getAllSettings();
    this.settings = settings[0];
    console.log('this.settings: ', this.settings);
    this.profile = await this._commonServices.getActiveProfile();
  }

  tooglePermission(id: 'ai' |'create' |'delete' |'duplicate'| 'edit') {
    this.settings.permissions[id] = !this.settings.permissions[id];
    this.updatePermission();
  }

  async updatePermission() {
    if(this.updating) { return; }
    this.updating = true;
    await this._commonServices.updateSetting(this.settings.id, this.settings);
    const settings = await this._commonServices.getAllSettings();
    this.settings = settings[0];

    // this._uiServices._notification('Permisos actualizados');
    this.updating = false;

  }
  //#endregion DATA

  //#region EVENTS
  cha
  //#endregion EVENTS

}
