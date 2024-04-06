import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileEntity } from 'src/app/shared/data/entities/entities';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { IExam } from 'src/app/shared/data/interfaces/IExam';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ExamsService } from 'src/app/shared/services/exams.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  _profileService = new ProfileService();
  _examService = new ExamsService();

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

  examsList: Array<IExam> = [];
  examTemporal: IExam | null = null;

  remaningExamn = null;
  editModeActive = false;

  constructor(
    private _router: Router,
    private eventService: EventBusService) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    const profile = this._profileService.getCurrentProfile();
    const exams = this._examService.getExamsDashboard();
    
    // this._examService.saveExamTemporal(exams[0]);
    this.examTemporal = this._examService.getExamTemporal();
    console.log('this.examTemporal: ', this.examTemporal);

    console.log('exams: ', exams);

    this.examsList = exams;

    if(!profile) {
      this.openModalProfile();
    } else {
      this.eventService.emit({ name: EVENTS.CONFIG,  component: 'header', value: profile });
    }

    this.modalCtl.afterchange = (evt: any) => {
      console.log('evt: ', evt);
    };
  }

  editMode() {
    this.editModeActive = !this.editModeActive;
    this.examsList.map((e: any) => e._showDetails = false);
  }

  //#region EVENTS

  //#region EXAM
  initExam(exam: any) {
    this._router.navigate( [`/dashboard/${ ScreenEnum.exam }/${ exam.id }`]);
  }

  detailsExam(exam: any) {
    this.examsList.map((e: any) => e._showDetails = false);

    if(this.editModeActive) {
      this.editExam(exam);
      return;
    }

    exam._showDetails = !exam._showDetails;
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

  
  createExam() {
    this._router.navigate( [`/dashboard/${ ScreenEnum.create }`]);
  }

  editExam(exam: any) {
    this._router.navigate( [`/dashboard/${ ScreenEnum.create }/${ exam.id }`]);
  }

  uploadExam() {
    this._router.navigate( [`/dashboard/upload`]);
  }

  //#endregion EVENTS
}
