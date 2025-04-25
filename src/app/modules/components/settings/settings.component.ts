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
  // #region IMPORT/EXPORTS
  export() {
    const exams = this._commonServices.getAllQuizs();
    console.log('exams: ', exams);
    this.copyClipboard(JSON.stringify(exams));
    this.downloadJSON(JSON.stringify(exams), 'collection-exam.json');
  }

  async import(evt: any) {
    var file = evt.target.files[0];
    const data = await this.readFile(file);

    try {
      const json = JSON.parse(data);
      // crear funcion que agrege el json de un solo paso
      this._commonServices.saveQuiz(json);
      this._uiServices.notification('Plantilla importada exitosamente', { type: 'success', closeTimer: 5000 });
    } catch (error) {
      this._uiServices.notification('Error al importar plantilla', { type: 'warning', closeTimer: 5000 });
    }
  }

  downloadJSON(data: any, name: string) {
    try {
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);

      var downloadElement = document.createElement("a");
      downloadElement.href = url;
      downloadElement.download = name;

      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      URL.revokeObjectURL(url);
      this._uiServices.notification('Exportación exitosa', { type: 'info', closeTimer: 3000 });
    } catch (error: any) {
      this._uiServices.notification(error, { type: 'warning', closeTimer: 5000 });
    }
  }

  readFile(archivo: any): Promise<string> {
    return new Promise((resolve) => {
      var lector = new FileReader();

      lector.onload = (evento: any) => {
        var contenido = evento.target.result;
        resolve(contenido);
      };

      lector.onerror = (evento: any) => {
        console.warn("Error al leer el archivo:", evento.target.error);
        this._uiServices.notification('Error al leer el archivo', { type: 'warning', closeTimer: 5000 });
        resolve('');
      };

      lector.readAsText(archivo);
    });
  }

  copyClipboard(text: string) {
    var temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    var success = document.execCommand("copy");
    document.body.removeChild(temp);
    return success;
  }
  //#endregion

  //#endregion EVENTS

}
