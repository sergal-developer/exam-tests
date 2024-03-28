import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { ProfileEntity } from 'src/app/shared/data/entities/entities';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  _profileService = new ProfileService();

  modalCtl = {
    title: '',
    size: 'medium',
    direction: 'center',
    open: false,
    closeOnClickOverlap: true,
    canClose: true,
    afterchange: new Function(),
    module: ''
  }

  profile: ProfileEntity = {
    userName: '',
    age: 0,
    current: true
  }

  messages = {
    profileValidation: { type: '', text: '' }
  }

  defaultAvatars = [
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/coffee_zorro_avatar_cup-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_female_woman_avatar-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/man_male_avatar_portrait-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/boy_male_avatar_portrait-512.png", selected: false },
    { url: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/female_woman_avatar_portrait-512.png", selected: false }
  ];

  examsList = [
    { id: 1, title: 'Patologias', questions: 30, timeResolution: 10, color: 'red', score: 0 },
    { id: 2, title: 'Terminos', questions: 30, timeResolution: 10, color: 'blue', score: 0 },
    { id: 3, title: 'Procedimientos', questions: 30, timeResolution: 10, color: 'green', score: 0 },
    { id: 4, title: 'Matematicas', questions: 30, timeResolution: 10, color: 'yellow', score: 0 },
    { id: 5, title: 'Español', questions: 30, timeResolution: 10, color: 'violet', score: 0 },
    { id: 6, title: 'Ciencias Naturales', questions: 30, timeResolution: 10, color: 'cyan', score: 0 },
    { id: 7, title: 'Apuntes', questions: 30, timeResolution: 10, color: 'red', score: 0 },
    { id: 8, title: 'Corazon', questions: 30, timeResolution: 10, color: 'blue', score: 0 },
    { id: 9, title: 'Pulmon', questions: 30, timeResolution: 10, color: 'green', score: 0 },
    { id: 10, title: 'Enfermedades', questions: 30, timeResolution: 10, color: 'yellow', score: 0 },
    { id: 11, title: 'Geriatrico', questions: 30, timeResolution: 10, color: 'violet', score: 0 },
    { id: 12, title: 'Elementos', questions: 30, timeResolution: 10, color: 'cyan', score: 0 },
  ];

  remaningExamn = null;

  constructor(private eventService: EventBusService) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    const profile = this._profileService.getCurrentProfile();
    if(!profile) {
      this.openModalProfile();
    } else {
      this.eventService.emit({ name: EVENTS.CONFIG,  component: 'header', value: profile });
    }

    this.modalCtl.afterchange = (evt: any) => {
      console.log('evt: ', evt);
    };
  }

  //#region EVENTS

  //#region EXAM
  initExam(exam: any) {
    this.eventService.emit({ name: EVENTS.SCREENS,  value: ScreenEnum.exam, data: exam });
    // this.eventService.emit({ name: EVENTS.CONFIG, component: 'subheader', value: exam });
  }
  //#endregion EXAM

  //#region PROFILE
  openModalProfile() {
      this.modalCtl.title = 'Cuentanos sobre ti';
      this.modalCtl.module = 'profile';
      this.modalCtl.closeOnClickOverlap = false;
      this.modalCtl.canClose = false;
      this.modalCtl.size = 'full';
      this.modalCtl.open = true;
  }

  selectAvatar(avatar: any) {
    this.defaultAvatars.map((x: any) => { x.selected = false });
    avatar.selected = true;
    this.profile.avatar = {
      url: avatar.url
    }
  }

  get validateProfile() {
    const valid = [];
    if(!this.profile.userName && !this.profile.userName.trim()) {
      valid.push('Ingresa un nombre');
    }

    if(!this.profile.avatar) {
      valid.push('Seleciona un avatar');
    }

    this.messages.profileValidation = { type: 'warning', text:  valid.join(' y ') };
    return valid.length;
  }

  createProfile() {
    this._profileService.saveProfile(this.profile);
    this.modalCtl.open = false;
    this.init();  
  }
  //#endregion PROFILE
  //#endregion EVENTS
}
