import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { AttemptEntity, ProfileEntity, QuizEntity, SettingsEntity } from '../data/entities/entities';
import { Utils } from '../data/utils/utils';
import { DBLocal } from './storage/db-storage';

@Injectable()
export class CommonServices {
  private utils = new Utils();
  private localDbName = 'simexamapp';
  private dbSettings = 'settings';
  private dbProfiles = 'profiles';
  private dbQuizs = 'quiz';
  private dbAttempts = 'attempts';

  constructor(private  _router: Router) { }

  //#region PUBLIC METHODS
  //#region SETTINGS
  getAllSettings(): Array<SettingsEntity> { return this.actionGetAll(this.dbSettings); }
  searchSetting(id: string, idfield = 'id'): SettingsEntity { return this.actionSearch(this.dbSettings, id, idfield); }
  filterSettings(id: string, idfield = 'id'): Array<SettingsEntity> { return this.actionFilter(this.dbSettings, id, idfield); }
  saveSetting(data: SettingsEntity) { return this.actionPost(this.dbSettings, data); }
  updateSetting(id: string, data: SettingsEntity, idfield = 'id') { return this.actionPut(this.dbSettings, id, data, idfield); }
  deleteSetting(id: string, idfield = 'id') { return this.actionDelete(this.dbSettings, id, idfield); }
  async getActiveSettings(): Promise<SettingsEntity> {
    const data: any = await this.getAllSettings();
    return data ? data[0] : null;
  }
  //#endregion SETTINGS

  //#region PROFILES
  getAllProfiles(): Array<ProfileEntity> { return this.actionGetAll(this.dbProfiles); }
  searchProfile(id: string, idfield = 'id'): ProfileEntity { return this.actionSearch(this.dbProfiles, id, idfield); }
  filterProfiles(id: string, idfield = 'id'): Array<ProfileEntity> { return this.actionFilter(this.dbProfiles, id, idfield); }
  saveProfile(data: ProfileEntity) { return this.actionPost(this.dbProfiles, data); }
  updateProfile(id: string, data: ProfileEntity, idfield = 'id') { return this.actionPut(this.dbProfiles, id, data, idfield); }
  deleteProfile(id: string, idfield = 'id') { return this.actionDelete(this.dbProfiles, id, idfield); }
  async getActiveProfile(): Promise<ProfileEntity> {
    const data: any = await this.getAllProfiles();
    return data ? data[0] : null;
  }
  //#endregion PROFILES

  //#region EXAMS
  getAllQuizs(): Array<QuizEntity> { return this.actionGetAll(this.dbQuizs); }
  searchQuiz(id: string, idfield = 'id'): QuizEntity { return this.actionSearch(this.dbQuizs, id, idfield); }
  filterQuizs(id: string, idfield = 'id'): Array<QuizEntity> { return this.actionFilter(this.dbQuizs, id, idfield); }
  saveQuiz(data: any) { return this.actionPost(this.dbQuizs, data); }
  updateQuiz(id: string, data: any, idfield = 'id') { return this.actionPut(this.dbQuizs, id, data, idfield); }
  deleteQuiz(id: string, idfield = 'id') { return this.actionDelete(this.dbQuizs, id, idfield); }
  //#endregion EXAMS

  //#region EXAMS_ATTEMPTS
  getAllAttempts(): Array<AttemptEntity> { return this.actionGetAll(this.dbAttempts); }
  searchAttempt(id: string, idfield = 'id'): AttemptEntity { return this.actionSearch(this.dbAttempts, id, idfield); }
  filterAttempts(id: string, idfield = 'id'): Array<AttemptEntity> { return this.actionFilter(this.dbAttempts, id, idfield); }
  saveAttempt(data: any) { return this.actionPost(this.dbAttempts, data); }
  updateAttempt(id: string, data: any, idfield = 'id') { return this.actionPut(this.dbAttempts, id, data, idfield); }
  deleteAttempt(id: string, idfield = 'id') { return this.actionDelete(this.dbAttempts, id, idfield); }
  //#endregion EXAMS_ATTEMPTS

  //#region NAVIGATION
  navigate(section: string, action?: string, id?: string) {
    if(!action) {
      this._router.navigate([section]);
    } else {
      if(id) {
        this._router.navigate([section, action, id]);
      } else {
        this._router.navigate([section, action]);
      }
    }
    
  }
  //#endregion NAVIGATION

  //#endregion PUBLIC METHODS

  //#region GENERIC
  private promiseMock(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(data);
      }, 200);
    });
  }

  private actionGetAll(tableName: string): any {
    const db = new DBLocal(this.localDbName);
    const response = db.get(tableName);
    return this.promiseMock(response);
  }

  private actionSearch(tableName: string, id: any, idfield = 'id'): any {
    const db = new DBLocal(this.localDbName);
    const response = db.search(tableName, id, idfield);
    return this.promiseMock(response);
  }

  private actionFilter(tableName: string, id: any, idfield = 'id'): any {
    const db = new DBLocal(this.localDbName);
    const response = db.filter(tableName, id, idfield);
    return this.promiseMock(response);
  }

  private actionPost(tableName: string, data: any): any {
    data.id = data.id ?? uuidv4();
    const db = new DBLocal(this.localDbName);
    const response = db.save(tableName, data);
    return this.promiseMock(response);
  }

  private actionPut(tableName: string, id: any, data: any, idfield = 'id'): any {
    const db = new DBLocal(this.localDbName);
    const response = db.update(tableName, id, data, idfield);
    return this.promiseMock(response);
  }

  private actionDelete(tableName: string, id: any, idfield = 'id'): any {
    const db = new DBLocal(this.localDbName);
    const response = db.delete(tableName, id, idfield);
    return this.promiseMock(response);
  }
  //#endregion GENERIC

  async initializData() {
    const setting: SettingsEntity = {
      language: 'es',
      permissions: {
        create: true,
        delete: false,
        duplicate: true,
        edit: true,
        ai: false
      },
      availableLanguages: [
        { name: 'Español', value: 'es' }, 
        { name: 'English', value: 'en' }
      ],
      premium: false
    }
    return await this.saveSetting(setting);
  }
}
