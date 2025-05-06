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

  constructor(private _router: Router) { }

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
    if (!action) {
      this._router.navigate([section]);
    } else {
      if (id) {
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


  //#region IA GEMINI
  async geminiGenerate(data: { topic: string, questions: number, options: number}) {
    const apiKey = atob('QUl6YVN5QktXS3RGX2ttMm81TWZDSzRFeGJ6OHVPOEpKWTBuZ2pZ');
    const model = 'gemini-2.0-flash';
    const prompt = `Genera un cuestionario sobre el tema "${ data.topic }" de ${ data.questions } preguntas en total, en cada pregunta debe tener de 2 a ${ data.options } opciones de respuesta, donde solo debe de existir una respuesta correcta, el resultado debe de seguir el sigueinte patron json:
    { questions: [{ "question": "pregunta a realizar", 
     "options": [{ "id": "indice del array", "text": ""posible respuesta" }], 
     "correctAnswer": "numero del id de la opcion correcta"
    }]}, si en la primer respuesta no se generan todas las preguntas envia un json valido donde queda la mayor cantidad solicitada.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const postData ={
        contents: 
        [{
          "parts":[{"text": prompt }]
        }]
      };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      console.log('response: ', response);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al llamar a la API de Gemini:', errorData);
        throw new Error(`Error al comunicarse con la API de Gemini: ${response.status} - ${JSON.stringify(errorData)}`);
      }
  
      const data = await response.json();
      // Procesar la respuesta
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const generatedText = this.normalizeResponse(data.candidates[0].content.parts[0].text);
        console.log('generatedText: ', generatedText);
        try {
          const cuestionarioJSON = JSON.parse(generatedText);
          return cuestionarioJSON;
        } catch (error) {
          console.error('Error al parsear la respuesta de Gemini:', error);
          throw new Error('Error al procesar la respuesta de Gemini.');
        }
      } else {
        console.error('Respuesta inesperada de la API de Gemini:', data);
        // throw new Error('Respuesta inesperada de la API de Gemini.');
        return null;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // throw error;
      return null;
    }
  }

  normalizeResponse(code: string) {
    let codeResult = code.replace('```json', '');
    codeResult = codeResult.replace('```', '')
    codeResult = codeResult.replace('\n', '');
    return codeResult;
  }
  //#endregion IA GEMINI
}
