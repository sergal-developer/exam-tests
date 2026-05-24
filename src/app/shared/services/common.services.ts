import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { AttemptEntity, LogEntity, ProfileEntity, QuizEntity, SettingsEntity, ThemeProps } from '../data/entities/entities';
import { Utils } from '../data/utils/utils';
import { DBLocal } from './storage/db-storage';
import { FileStorage } from './storage/file-storage';
import { AnswerAttemptRow, AnswerOptionRow, AnswerRow, DatabaseService, LogRow, QuizAttemptRow, QuizRow, SettingRow, ThemeRow, UserRow } from './database/sql.database.service';
import { IAnswerDTO, IAnswerOptionDTO, ILogDTO, IQuizAttemptDTO, IQuizDTO, ISettingsDTO, IThemeDTO, IUserDTO } from '../data/entities/dtos';

@Injectable()
export class CommonServices {
  private utils = new Utils();
  private localDbName = 'simexamapp';
  private dbSettings = 'settings';
  private dbProfiles = 'profiles';
  private dbQuizs = 'quiz';
  private dbAttempts = 'attempts';
  private dbLogs = 'logs';

  private fileStorage = new FileStorage();
  private fileSettings = 'settings.json';
  private fileProfiles = 'profile.json';
  private fileQuizs = 'templateQuiz.json';
  private fileAttempts = 'attempts.json';
  private fileLogs = 'logs.json';
  private fileObject = { data: [] };

  constructor(private _router: Router, private _services: DatabaseService) { }

  //#region PUBLIC METHODS

  async checkFiles() {
    const settings = await this.fileStorage.checkFile(this.fileSettings);
    if (!settings) {
      this.fileStorage.saveFile(this.fileSettings, this.fileObject);
    }
    const profile = await this.fileStorage.checkFile(this.fileProfiles);
    if (!profile) {
      this.fileStorage.saveFile(this.fileProfiles, this.fileObject);
    }
    const quiz = await this.fileStorage.checkFile(this.fileQuizs);
    if (!quiz) {
      this.fileStorage.saveFile(this.fileQuizs, this.fileObject);
    }
    const attempts = await this.fileStorage.checkFile(this.fileAttempts);
    if (!attempts) {
      this.fileStorage.saveFile(this.fileAttempts, this.fileObject);
    }

  }

  async clearDB() {
    await this.fileStorage.deleteFile(this.fileSettings);
    await this.fileStorage.deleteFile(this.fileProfiles);
    await this.fileStorage.deleteFile(this.fileQuizs);
    await this.fileStorage.deleteFile(this.fileAttempts);
  }

  //#region SETTINGS
  async getAllSettings(): Promise<ISettingsDTO[]> { return await this._services.getAllSettings(); }
  async getCurrentSettings(): Promise<ISettingsDTO> {
    const response = await this._services.getSettingCompleteById(0);
    return response && response.length ? response[0] : null;
  }
  async getSettingById(id: number): Promise<ISettingsDTO> {
    const response = await this._services.getSettingCompleteById(id);
    return response && response.length ? response[0] : null;
  }
  async saveSettings(data: SettingRow): Promise<ISettingsDTO[]> {
    const response = await this._services.postSetting(data);
    return response;
  }
  async updateSettings(data: SettingRow): Promise<ISettingsDTO> {
    await this._services.postSetting(data);
    return this.getSettingById(data.settingId);
  }
  //#endregion SETTINGS

  //#region THEMES
  async getThemes(): Promise<IThemeDTO[]> { return await this._services.getAllThemes(); }

  async saveTheme(data: ThemeRow): Promise<IThemeDTO> {
    const response = await this._services.postTheme(data);
    return response;
  }
  //#endregion THEMES

  //#region USERS
  async getAllUsers() {
    return await this._services.getAllUsers();
  }

  async getUserById(userId: number) {
    let response = await this._services.getUserById(userId);
    return response && response.length ? response[0] : null;
  }

  async getCurrentUser(): Promise<IUserDTO> {
    let response = await this._services.getCurrentUser();
    return response && response.length ? response[0] : null;
  }

  async postUser(user: UserRow) {
    let response = await this._services.postUser(user);
    return response && response.length ? response[0] : null;
  }

  async deleteUser(userId: number) {
    let response = await this._services.deleteUser(userId);
    return response && response.length ? response[0] : null;
  }
  //#endregion USERS

  //#region QUIZ
  async getAllQuizs(): Promise<IQuizDTO[]> {
    let response: IQuizDTO[] = await this._services.getAllQuizzes();
    return response;
  }

  async getQuizById(quizId: number): Promise<IQuizDTO> {
    let response = await this._services.getQuizById(quizId);
    return response && response.length ? response[0] : null;
  }

  async saveQuiz(quiz: QuizRow): Promise<IQuizDTO> {
    let response = await this._services.postQuiz(quiz);
    return response && response.length ? response[0] : null;
  }

  async deleteQuiz(quizId: number): Promise<IQuizDTO> {
    let response = await this._services.deleteQuiz(quizId);
    return response && response.length ? response[0] : null;
  }
  //#endregion QUIZ

  //#region QUIZ_AWNSWERS
  async getAllAnswers(): Promise<IAnswerDTO[]> {
    let response: IAnswerDTO[] = await this._services.getAllAnswers();
    return response;
  }

  async getAnswersByQuiz(quizId: number): Promise<IAnswerDTO> {
    let response = await this._services.getAnswersByQuiz(quizId);
    return response && response.length ? response[0] : null;
  }

  async saveAnswer(data: AnswerRow): Promise<IAnswerDTO> {
    let response = await this._services.postAnswer(data);
    return response && response.length ? response[0] : null;
  }

  async deleteAnswer(id: number): Promise<IAnswerDTO> {
    let response = await this._services.deleteAnswer(id);
    return response && response.length ? response[0] : null;
  }
  //#endregion QUIZ_AWNSWERS

  //#region AWNSWERS_OPTIONS
  async getOptionsByAnswer(answerId: number): Promise<IAnswerOptionDTO[]> {
    return await this._services.getOptionsByAnswer(answerId);
  }

  async saveAnswerOption(data: AnswerOptionRow): Promise<IAnswerOptionDTO> {
    let response = await this._services.postAnswerOption(data);
    return response && response.length ? response[0] : null;
  }

  async deleteAnswerOption(id: number): Promise<IAnswerOptionDTO> {
    let response = await this._services.deleteAnswerOption(id);
    return response && response.length ? response[0] : null;
  }
  //#endregion AWNSWERS_OPTIONS

  //#region QUIZ_ATTEMPS
  async getAttemptsByUser(userId: number): Promise<IQuizAttemptDTO[]> {
    let response: IQuizAttemptDTO[] = await this._services.getAttemptsByUser(userId);
    return response;
  }

  async getAttemptById(attemptId: number): Promise<IQuizAttemptDTO[]> {
    let response: IQuizAttemptDTO[] = await this._services.getAttemptById(attemptId);
    return response;
  }

  async saveQuizAttempt(data: QuizAttemptRow): Promise<IQuizAttemptDTO> {
    let response = await this._services.postQuizAttempt(data);
    return response && response.length ? response[0] : null;
  }

  async deleteQuizAttempt(attemptId: number): Promise<IQuizDTO> {
    let response = await this._services.deleteQuizAttempt(attemptId);
    return response && response.length ? response[0] : null;
  }
  //#endregion QUIZ_ATTEMPS

  //#region AWNSWERS_ATTEMPTS
  async getAnswerAttemptsByAttempt(attemptId: number): Promise<IAnswerDTO[]> {
    let response: IAnswerDTO[] = await this._services.getAnswerAttemptsByAttempt(attemptId);
    return response;
  }

  async postAnswerAttempt(data: AnswerAttemptRow): Promise<IAnswerDTO> {
    let response = await this._services.postAnswerAttempt(data);
    return response && response.length ? response[0] : null;
  }
  //#endregion AWNSWERS_ATTEMPTS

  //#region LOGS
  async getAllLogs(): Promise<ILogDTO> { 
    return await this._services.getAllLogs();
  }

  async getLogById(id: number): Promise<ILogDTO> { 
    const response = await this._services.getLogById(id);
    return response && response.length ? response[0] : null;
  }

  async postLog(data: LogRow): Promise<ILogDTO> { 
    return await this._services.postLog(data);
  }

  async deleteLog(id: number): Promise<ILogDTO> { 
    const response = await this._services.deleteLog(id);
    return response && response.length ? response[0] : null;
  }
  //#endregion LOGS

  //#region NAVIGATION
  navigate(section: string, action?: string, id?: string, props?: any) {
    let params = [];
    props = props || {};
    props.action = action;
    props.id = id || null;

    if (props) {
      const keys = Object.keys(props);
      keys.map((key) => {
        if (props[key]) {
          params.push(`${key}=${props[key]}`);
        }
      })
    }

    if (!props.action) {
      this._router.navigateByUrl(`/${section}`);
    } else {
      let paramsUrl = '';
      params.map((param, index) => {
        paramsUrl = index == 0 ? `?${param}` : `${paramsUrl}&${param}`;
      });
      this._router.navigateByUrl(`/${section}${paramsUrl}`);
    }
  }
  //#endregion NAVIGATION

  //#endregion PUBLIC METHODS

  //#region GENERIC
  private actionGetAll(fileName: string): any {
    return new Promise(async (resolve) => {
      try {
        const data = await this.fileStorage.readFile(fileName);
        if (data) {
          resolve(data.data.length ? data.data : null);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.warn(error)
        resolve(null);
      }
    });
  }

  private actionSearch(fileName: string, id: any, idfield = 'id'): any {
    return new Promise(async (resolve) => {
      try {
        const data = await this.actionGetAll(fileName);
        if (data) {
          const search = this.fileStorage.search(data, id, idfield);
          resolve(search);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.warn(error)
        resolve(null);
      }
    });
  }

  private actionFilter(fileName: string, id: any, idfield = 'id'): any {
    return new Promise(async (resolve) => {
      try {
        const data = await this.actionGetAll(fileName);
        if (data) {
          const search = this.fileStorage.filter(data, id, idfield);
          resolve(search);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.warn(error)
        resolve(null);
      }
    });
  }

  private actionPost(fileName: string, data: any): any {
    data.id = data.id ?? uuidv4();
    return new Promise(async (resolve) => {
      try {
        const db = await this.actionGetAll(fileName);
        const fileObject = JSON.parse(JSON.stringify(this.fileObject));
        if (db) { fileObject.data = db; }
        fileObject.data.push(data);
        await this.fileStorage.saveFile(fileName, fileObject);
        resolve(data);

      } catch (error) {
        console.warn(error)
        resolve(null);
      }
    });
  }

  private actionPut(fileName: string, id: any, data: any, idfield = 'id'): any {
    return new Promise(async (resolve) => {
      try {
        const db = await this.actionGetAll(fileName);
        const fileObject = JSON.parse(JSON.stringify(this.fileObject));
        if (db) { fileObject.data = db; }
        fileObject.data = this.fileStorage.update(fileObject.data, id, data, idfield);
        await this.fileStorage.saveFile(fileName, fileObject);
        resolve(data);

      } catch (error) {
        console.warn(error)
        resolve(null);
      }
    });
  }

  private actionDelete(fileName: string, id: any, idfield = 'id'): any {
    return new Promise(async (resolve) => {
      try {
        const db = await this.actionGetAll(fileName);
        const fileObject = JSON.parse(JSON.stringify(this.fileObject));
        if (db) { fileObject.data = db; }
        fileObject.data = this.fileStorage.delete(db, id, idfield);
        await this.fileStorage.saveFile(fileName, fileObject);
        resolve(true);
      } catch (error) {
        console.warn(error)
        resolve(null);
      }
    });
  }
  //#endregion GENERIC



  //#region DEFAULT_DATA
  defaultThemeLight: ThemeProps = {
    appBackground: '#bebebe',
    appColor: '#2d2d2d',
    appFontSize: '16px',
    textFontSize: '16px',
    primary: '#174FA1',
    primaryBackground: '#174FA1',
    primaryBackgroundHover: '#346ec5',
    primaryColor: '#ffffff',
    secondary: '#B30ECF',
    secondaryBackground: '#d47ce3',
    secondaryBackgroundHover: '#be29d8',
    secondaryBackgroundAlterHover: '#bdbdbd',
    secondaryColor: '#000000',
    accent: '#826713',
    accentBackground: '#B30ECF',
    accentBackgroundHover: '#be29d8',
    accentColor: '#444444',
    scrollColor: '#919191',
    scrollBackground: '#940d82',
    formErrorColor: '#a70019',
    formBackground: 'rgba(222, 222, 222, 0.7)',
    formBackgroundSolid: '#494949',
    notificationColor: '#d0d0d0',
    notificationColorContrast: '#000000',
    notificationSuccess: '#8e9f0f',
    notificationWarning: '#edc464',
    notificationError: '#c12323',
    notificationInfo: '#a6cce3',
    gradeBackgroundPassed: '#E1ECE4',
    gradeColorPassed: '#074b07',
    gradeBackgroundFailed: '#FFE5E7',
    gradeColorFailed: '#620e15',
    gradeBackgroundBarely: '#F6EDC8',
    gradeColorBarely: '#453a0b',
    gradePanelPassed: 'rgba(69, 83, 65, 0.5)',
    gradePanelFailed: 'rgba(204, 166, 166, 0.5)',
    gradePanelBarely: 'rgba(89, 89, 20, 0.5)',
    pillBackground: '#d4d4d4',
    pillColor: '#9b9b9b',
    rootHeroBackground: '#2b2b2b',
    timerBarBackground: '#81b181',
    timerBarContainerBackground: 'rgb(200, 200, 200)',
    statusBackground: '#9c9898',
    answerBorderColor: '#919191',
    answerSelectedColor: '#3a3a3a',
    answerSelectedBackground: '#a9c8e7',
    answerCorrectColor: '#ffffff',
    answerCorrectColorText: '#06700b',
    answerCorrectBorderColor: '#b8ded4',
    answerCorrectBackground: '#3e8246',
    answerIncorrectColor: '#e5acac',
    answerIncorrectBackground: '#630f2b',
    answerIncorrectBorderColor: '#c34c74',
    grayBackdropBackground: 'rgba(225, 225, 225, 0.4)',
    borderColorTransparent: 'rgba(0, 0, 0, 0.5)',
    matLabelBackground: 'rgba(238, 238, 238, 0.7)',
    matLabelContrastBackground: 'rgba(76, 76, 76, 0.7)',
    itemOptionBorder: 'rgba(64, 64, 64, 0.5)',
    stadisticBackground: 'rgba(193, 191, 191, 0.5)'
  };

  defaultThemeDark: ThemeProps = {
    appBackground: '#000000',
    appColor: '#d0d0d0',
    appFontSize: '16px',
    textFontSize: '16px',
    primary: '#174FA1',
    primaryBackground: '#174FA1',
    primaryBackgroundHover: '#346ec5',
    primaryColor: '#FFFCFF',
    secondary: '#B30ECF',
    secondaryBackground: '#B30ECF',
    secondaryBackgroundHover: '#be29d8',
    secondaryBackgroundAlterHover: '#251725',
    secondaryColor: '#e4e4e4',
    accent: '#FFD477',
    accentBackground: '#FFD477',
    accentBackgroundHover: '#d1aa56',
    accentColor: '#444444',
    scrollColor: '#919191',
    scrollBackground: '#940d82',
    formErrorColor: '#f08d9c',
    formBackground: 'rgba(33, 33, 33, 0.7)',
    formBackgroundSolid: '#494949',
    notificationColor: '#d0d0d0',
    notificationColorContrast: '#000000',
    notificationSuccess: '#8e9f0f',
    notificationWarning: '#edc464',
    notificationError: '#c12323',
    notificationInfo: '#a6cce3',
    gradeBackgroundPassed: '#E1ECE4',
    gradeColorPassed: '#074b07',
    gradeBackgroundFailed: '#FFE5E7',
    gradeColorFailed: '#620e15',
    gradeBackgroundBarely: '#F6EDC8',
    gradeColorBarely: '#453a0b',
    gradePanelPassed: 'rgba(69, 83, 65, 0.5)',
    gradePanelFailed: 'rgba(43, 11, 17, 0.5)',
    gradePanelBarely: 'rgba(89, 89, 20, 0.5)',
    pillBackground: '#3d3d3d',
    pillColor: '#585858',
    rootHeroBackground: '#2b2b2b',
    timerBarBackground: '#0c770c',
    timerBarContainerBackground: 'rgb(200, 200, 200)',
    statusBackground: '#323232',
    answerBorderColor: '#919191',
    answerSelectedColor: '#ebebeb',
    answerSelectedBackground: '#4287cf',
    answerCorrectColor: '#ffffff',
    answerCorrectColorText: '#06700b',
    answerCorrectBorderColor: '#b8ded4',
    answerCorrectBackground: '#2E5248',
    answerIncorrectColor: '#e5acac',
    answerIncorrectBackground: '#630f2b',
    answerIncorrectBorderColor: '#c34c74',
    grayBackdropBackground: 'rgba(50, 50, 50, 0.7)',
    borderColorTransparent: 'rgba(0, 0, 0, 0.5)',
    matLabelBackground: 'rgba(61, 61, 61, 0.7)',
    matLabelContrastBackground: 'rgba(76, 76, 76, 0.7)',
    itemOptionBorder: 'rgba(64, 64, 64, 0.5)',
    stadisticBackground: 'rgba(0, 0, 0, 0.5)'
  };

  async getStructure() {
    return await this._services.getStructure();
  }

  async setDefaultData(): Promise<ISettingsDTO> {
    let settings = await this._services.getSettingCompleteById(0);
    let response: ISettingsDTO = null;

    if (!settings.length) {
      await this._services.postLanguage({ name: 'Español', value: 'es' });
      await this._services.postLanguage({ name: 'English', value: 'en' });
      await this._services.postTheme({ id: 'light', content: this.defaultThemeLight });
      await this._services.postTheme({ id: 'dark', content: this.defaultThemeDark });

      const permissions = {
        create: true,
        delete: false,
        duplicate: false,
        edit: true,
        ai: true
      };

      await this._services.postSetting({ settingId: 0, language: 'en', theme: 'dark', permissions: permissions });
      settings = await this._services.getSettingCompleteById(0);
    }

    response = settings && settings.length ? settings[0] : null;
    return response;
  }

  async getActiveUser() {
    let users = await this._services.getAllUsers();
    return users && users.length ? users[0] : null;
  }
  //#endregion DEFAULT_DATA

  //#region IA GEMINI
  async geminiGenerate(data: { topic: string, questions: number, options: number, language: string }) {
    const apiKey = atob('QUl6YVN5QktXS3RGX2ttMm81TWZDSzRFeGJ6OHVPOEpKWTBuZ2pZ');
    const model = 'gemini-2.0-flash';
    const prompt = `Genera un cuestionario sobre el tema "${data.topic}" de ${data.questions} preguntas en total, en cada pregunta debe tener de 2 a ${data.options} opciones de respuesta, donde solo debe de existir una respuesta correcta, el resultado debe de seguir el sigueinte patron json:
    { questions: [{ "question": "pregunta a realizar", 
     "options": [{ "id": "indice del array", "text": ""posible respuesta" }], 
     "correctAnswer": "numero del id de la opcion correcta"
    }]}, si en la primer respuesta no se generan todas las preguntas envia un json valido donde este la mayor cantidad solicitada, ademas que los valores deben de estar en el idioma ${data.language}`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const postData = {
      contents:
        [{
          "parts": [{ "text": prompt }]
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al llamar a la API de Gemini:', errorData);
        throw new Error(`Error al comunicarse con la API de Gemini: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      // Procesar la respuesta
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        // this.saveLog(data.candidates[0].content.parts[0].text);
        const generatedText = this.normalizeResponse(data.candidates[0].content.parts[0].text);

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
