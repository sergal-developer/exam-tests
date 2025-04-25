import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileEntity, SettingsEntity } from 'src/app/shared/data/entities/entities';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { IExam } from 'src/app/shared/data/interfaces/IExam';
import { IHeader } from 'src/app/shared/data/interfaces/IUI';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { CommonServices } from 'src/app/shared/services/common.services';
import { v4 as uuidv4 } from 'uuid';
import { MainServices } from '../../main.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

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
  settings: SettingsEntity = {
    colors: [],
    language: '',
    permissions: {
      create: false,
      delete: false,
      duplicate: false,
      edit: false,
      ai: false
    },
    availableLanguages: [],
    premium: false
  }

  isNewSession = false;

  messages = {
    profileValidation: { type: '', text: '' }
  }

  defaultAvatars = [
    { url: "/assets/avatar1.svg", selected: false },
    { url: "/assets/avatar2.svg", selected: false },
    { url: "/assets/avatar3.svg", selected: false },
    { url: "/assets/avatar4.svg", selected: false },
    { url: "/assets/avatar5.svg", selected: false },
    { url: "/assets/avatar6.svg", selected: false },
  ];

  examsList: Array<IExam> = [];
  examTemporal: IExam | null = null;

  remaningExamn = null;
  editModeActive = false;

  constructor(
    private _router: Router,
    private eventService: EventBusService,
    private _mainServices: MainServices,
    private _commonServices: CommonServices) {}

  ngOnInit() {
    // this.init();
    this.checkData();
  }

  async checkData() {
    let profile: ProfileEntity = null;
    let profiles: any = await this._commonServices.getAllProfiles();
    let settings: any = await this._commonServices.getAllSettings();
    this.examsList = await this._commonServices.getAllExamns();
    console.log('data: ', this.examsList);
    
    this.isNewSession = profiles ? true : false;

    if(!profiles) {
      this.openModalProfile();
      return;
    } else {
      profile = profiles[0];
    }

    if(!settings) {
      await this._commonServices.initializData();
      settings = await this._commonServices.getAllSettings();
    }
    this.settings = settings[0];

    const header: IHeader = {
      type: 'profile',
      title: `Hola, ${ profile.userName }`,
      avatar: profile.avatar.url,
      headerClass: '',
      mainClass: '',
      mainStyle: 'background: #ffffff',
    }
    this.eventService.emit({ name: EVENTS.CONFIG, component: 'header', value: header });
  }

  editMode() {
    this.editModeActive = !this.editModeActive;
    this.examsList.map((e: any) => {e._showDetails = false});
  }

  //#region EVENTS

  //#region EXAM
  _loadExamState = false
  initExam(exam: any) {
    
    this._loadExamState = true
    setTimeout(() => {
      this._router.navigate( [`/dashboard/${ ScreenEnum.exam }/${ exam.id }`]);
      this._loadExamState = false
    }, 1000);
  }

  detailsExam(exam: any) {
    this.examsList.map((e: any) => e._showDetails = false);
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

  async createProfile() {
    const profile: ProfileEntity = this.profile;
    // profile.userId = uuidv4();

    const response = await this._commonServices.saveProfile(profile);
    // this._profileService.saveProfile(this.profile);
    this.modalCtl.open = false;
    this.checkData();
  }
  //#endregion PROFILE

  
  createExam() {
    this._router.navigate( [`/dashboard/${ ScreenEnum.create }`]);
  }

  editExam(exam: any) {
    this._router.navigate( [`/dashboard/${ ScreenEnum.create }/${ exam.id }`]);
  }

  duplicateExam(exam: any) {
    const newExam: IExam = JSON.parse(JSON.stringify(exam));
    newExam.attempts = 0;
    newExam.completed = false;
    newExam.score = 0;
    newExam.timeEnlapsed = 0;
    delete newExam._showDetails;
    
    this._commonServices.saveExamn(newExam);
    this._mainServices.notification(`Se ha duplicado <b>${ exam.title }</b> correctamente.`, { type: 'info', closeTimer: 3000 });
    this.checkData();
  }

  async deleteExam(exam: IExam) {
    let exams = this._commonServices.getAllExamns();
    exams = exams.filter((x: IExam) => x.id !== exam.id);
    await this._commonServices.deleteExamn(exam.id);
    // this._examService.saveExamCollection(exams);
    this._mainServices.notification(`Se elimino el examen <b>${ exam.title }</b>, ¿estas seguro?`, { type: 'warning', closeTimer: 3000 });
    this.checkData();
  }

  goToSettings() {
    this._router.navigate( [`/dashboard/settings`]);
  }

  //#endregion EVENTS
}
