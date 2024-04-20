import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { MainServices } from '../../main.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { IHeader } from 'src/app/shared/data/interfaces/IUI';
import { ExamsService } from 'src/app/shared/services/exams.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {

  _profileService = new ProfileService();
  _examService = new ExamsService();

  profile: any = null;
  profileTemp: any = null;

  settings: any = null;
  settingsTemp: any = null;

  languages = ['ESPAÑOL', 'ENGLISH']
  constructor(private eventService: EventBusService,
            private _mainServices: MainServices
  ) { }


  data: any = {};
  screen = 'firstScreen';
  module: any = null;
  moduleTitle = '';

  defaultAvatars = [
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/coffee_zorro_avatar_cup-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_female_woman_avatar-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/man_male_avatar_portrait-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/boy_male_avatar_portrait-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/female_woman_avatar_portrait-512.png", selected: false }
  ];

  ngOnInit() {
    this.updateHeaders();
    this.setup();
  }

  async setup() {
      this.profile = this._profileService.getCurrentProfile();
      this.settings = this._profileService.getSettings();
  }

  updateHeaders(props?: { hide: boolean }) {
    const type = props && props.hide ? 'hide' : 'progress'
    const header: IHeader = {
      type: type,
      title: 'Configuración',
      headerClass: '',
      mainClass: '',
      mainStyle: 'background: #f5ebd7',
      canEditTitle: false,
      exam: {
        color: '#f9df90',
        completed: false,
        current: 0  ,
        progress: '0',
        questionsLenght: 0,
        time: ''
      }
    }
    this.eventService.emit({ name: EVENTS.CONFIG, component: 'header', value: header });
  }

  //#region ACTIONS
  editUser() {
    this.updateHeaders({ hide: true });
    this.screen = 'secondScreen';
    this.module = 'user';
    // this.profileTemp = JSON.parse(JSON.stringify(this.profile));
    this.profileTemp = {...this.profile};
    this.scrollTop('.row-internal .container.list');
    setTimeout(() => {
      // this.eventService.emit({ name: EVENTS.CONFIG, component: 'reset', value: 'hide-header' });
    }, 500);
  }

  editStyles() {
    this.settingsTemp = {...this.settings};
    this.updateHeaders({ hide: true });
    this.screen = 'secondScreen';
    this.module = 'colors';
    this.scrollTop('.row-internal .container.list');
    setTimeout(() => {
      // this.eventService.emit({ name: EVENTS.CONFIG, component: 'reset', value: 'hide-header' });
    }, 500);
  }

  goToModule(module: string) {
    this.updateHeaders({ hide: true });
    this.screen = 'secondScreen';
    this.module = module;
    this.scrollTop('.row-internal .container.list');
  }

  scrollTop(selector: string) {
    const element: any = document.querySelector(selector);
    console.log('element.scrollTop: ', element.scrollTop);
    
    element.scrollTop = 0;
  }

  returnMenu() {
    this.screen = 'firstScreen';
    setTimeout(() => {
      this.module = '';
      this.updateHeaders();
    }, 500);
  }

  selectAvatar(avatar: any) {
    this.defaultAvatars.map((x: any) => { x.selected = false });
    avatar.selected = true;
    this.profileTemp.avatar = {
      url: avatar.url
    }
  }

  saveChangesProfile() {
    this.profile = this.profileTemp;
    this._profileService.saveProfile(this.profile);
    
    this.setup();
    this.returnMenu();
  }

  saveChangesStyles() {
    this.settings = this.settingsTemp;
    this._profileService.saveSettings(this.settings);
    
    this.setup();
    this.returnMenu();
  }

  saveSettingsChanges() {
    this._profileService.saveSettings(this.settings);
  }

  selectColor(evt: any) {
    try {
      const color = evt.target.value;
      if(color) {
        this.settingsTemp.colors = this.settingsTemp.colors.filter((x: string) => x != color);
        this.settingsTemp.colors.push(color);
        console.log('this.settingsTemp.colors: ', this.settingsTemp.colors);
      }
    } catch (error) {
      console.warn('selectColor-error: ', error);
    }
  }

  switchLanguage() {
    const index = this.languages.findIndex((x) => x == this.settings.language );
    const limit = this.languages.length - 1;
    if(index >= 0) {
      const language = this.languages[index + 1];
      this.settings.language = language || this.languages[0];
      this.saveSettingsChanges();
    }
  }
  //#endregion ACTIONS

  // #region IMPORT/EXPORTS
  export() {
    const exams = this._examService.getExams();
    console.log('exams: ', exams);
    // this.exportData = exams;
    this.copyClipboard(JSON.stringify(exams));
    this.downloadJSON(JSON.stringify(exams), 'collection-exam.json');
  }

  async import(evt: any) {
    var file = evt.target.files[0];
    const data = await this.readFile(file);

    try {
      const json = JSON.parse(data);
      this._examService.saveExamCollection(json);
      this._mainServices.notification('Plantilla importada exitosamente', { type: 'success', closeTimer: 5000 });
    } catch (error) {
      this._mainServices.notification('Error al importar plantilla', { type: 'warning', closeTimer: 5000 });
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
      this._mainServices.notification('Exportación exitosa', { type: 'info', closeTimer: 3000 });
    } catch (error: any) {
      this._mainServices.notification(error, { type: 'warning', closeTimer: 5000 });
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
        this._mainServices.notification('Error al leer el archivo', { type: 'warning', closeTimer: 5000 });
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
}