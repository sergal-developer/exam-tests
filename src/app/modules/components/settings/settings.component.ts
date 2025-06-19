import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileEntity, SettingsEntity, ThemeProps } from 'src/app/shared/data/entities/entities';
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
  pendingChanges: {
    profile?: ProfileEntity,
    settings?: SettingsEntity;
  }
  profileUI = {
    avatarEdit: false,
    usernameEdit: false,
  };

  updating = false;

  defaultAvatars = [
    { url: "/assets/avatar-1.svg", selected: false },
    { url: "/assets/avatar-2.svg", selected: false },
    { url: "/assets/avatar-3.svg", selected: false },
    { url: "/assets/avatar-4.svg", selected: false },
    { url: "/assets/avatar-5.svg", selected: false },
    { url: "/assets/avatar-6.svg", selected: false },
    { url: "/assets/avatar-7.svg", selected: false },
    { url: "/assets/avatar-8.svg", selected: false },
  ];
  availableThemes = ['light', 'dark']
  form: FormGroup;
  themeProps: Array<{ name: string, value: string }> = null;
  customizeColorsMode = false;

  constructor(private _commonServices: CommonServices,
    private _uiServices: UiServices,
    private translate: TranslateService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getSettings();
  }

  //#region DATA
  async getSettings() {
    const settings = await this._commonServices.getAllSettings();
    this.settings = settings[0];
    this.profile = await this._commonServices.getActiveProfile();

    this.form = this.fb.group({
        name: [this.profile.userName, Validators.required],
    });
    this.form.get('name').disable();

    try {
      this.themeProps = this.getKeysThemeProps(this.settings.themeProps[this.settings.theme]);
    } catch (error) {
      console.log('error: ', error);

    }
  }

  tooglePermission(id: 'ai' | 'create' | 'delete' | 'duplicate' | 'edit') {
    this.settings.permissions[id] = !this.settings.permissions[id];
    this.updatePermission();
  }

  async updatePermission() {
    if (this.updating) { return; }
    this.updating = true;
    await this._commonServices.updateSetting(this.settings.id, this.settings);
    const settings = await this._commonServices.getAllSettings();
    this.settings = settings[0];

    // this._uiServices._notification('Permisos actualizados');
    this.updating = false;

  }

  async changeLanguage(language) {
    const languages = [];
    this.settings.availableLanguages.map((lan) => {
      languages.push(lan.value);
    })
    this.translate.addLangs(languages);
    this.settings.language = language;

    this.translate.setDefaultLang(this.settings.language);
    await this._commonServices.updateSetting(this.settings.id, this.settings);
  }

  changeTheme(theme) {
    this.settings.theme = theme;
    // if(!this.settings.themeProps) {
      this.settings.themeProps = {
        light: this._commonServices.defaultThemeLight,
        dark: this._commonServices.defaultThemeDark
      }
    // }
    this._uiServices.applyTheme(this.settings.themeProps[this.settings.theme.toLowerCase()])
    
    try {
      this.themeProps = this.getKeysThemeProps(this.settings.themeProps[this.settings.theme.toLowerCase()]);
    } catch (error) {}

    this.updatePermission();
  }
  //#endregion DATA

  //#region EVENTS
  selectAvatar(item) {
    this.defaultAvatars.map(image => {
      image.selected = image.url == item.url ? true : false;
    });
    this.profile.avatar.url = item.url;

    // SAVE DATA 
  }

  editAvatar() {
    this.profileUI.avatarEdit = !this.profileUI.avatarEdit;
    if(this.profileUI.avatarEdit) {
      this.defaultAvatars.map((avatar) => {
        avatar.selected = avatar.url == this.profile.avatar.url;
      });
    } else {
      this.saveDataProfile();
    }
  }

  editUsername() {
    this.profileUI.usernameEdit = !this.profileUI.usernameEdit;
    if(this.profileUI.usernameEdit) {
      this.form.get('name').enable();
    } else {
      this.form.get('name').disable();
    }
  }

  editUsernameConfirm() {
    this.profile.userName = this.form.get('name').value;
    this.editUsername();

    this.saveDataProfile();
  }

  editUsernameCancel() {
    this.form.get('name').setValue(this.profile.userName);
    this.editUsername();
  }

  customizeColors() {
    this.customizeColorsMode = !this.customizeColorsMode;
  }

  updateColors(prop: any ) {
    const changes = this.buildKeysThemeProps(this.themeProps);
    const base = this.settings.themeProps[this.settings.theme];
    this.settings.themeProps[this.settings.theme] = { ...base, ...changes };

    setTimeout(() => {
      this._uiServices.applyTheme(this.settings.themeProps[this.settings.theme]);
    }, 300);
  }

  async saveDataProfile() {
    const result = await this._commonServices.updateProfile(this.profile.id, this.profile);
    return result;
  }

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

  getKeysThemeProps(ThemeProps: ThemeProps) {
    if(!ThemeProps) return null;
    const result = [];
    Object.keys(ThemeProps).map((key) => {
      if(!ThemeProps[key].includes('px')) {
        result.push({ name: key, value: ThemeProps[key], _style: `background: ${ ThemeProps[key] };` });
      }
    });
    return result;
  }

  buildKeysThemeProps(props: Array<{ name: string, value: string }>) {
    const result = {};
    props.map((item) => {
      result[item.name] = item.value;
    });
    return result;
  }
  //#endregion

  //#endregion EVENTS

}
