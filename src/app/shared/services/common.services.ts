import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerDTO, AnswerOptionDTO, LogDTO, AttemptAnswerDTO, AttemptDTO, QuizDTO, SettingsDTO, ThemeDTO, UserDTO, ThemePropertiesDTO } from '../data/entities/dtos';
import { Utils } from '../data/utils/utils';
import { DatabaseService } from './database/sql.database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommonServices {
  private utils = new Utils();

  constructor(private _router: Router, private _services: DatabaseService) { }

  //#region PUBLIC METHODS

  //#region SETTINGS
  async getAllSettings(): Promise<SettingsDTO[]> {
    return await this._services.getAllSettings();
  }

  async getCurrentSettings(): Promise<SettingsDTO> {
    return await this._services.getSettingCompleteById(0);
  }

  async getSettingById(id: number): Promise<SettingsDTO> {
    return await this._services.getSettingCompleteById(id)
  }

  async saveSettings(data: SettingsDTO): Promise<SettingsDTO> {
    return await this._services.postSetting(data);
  }

  async updateSettings(data: SettingsDTO): Promise<SettingsDTO> {
    await this._services.postSetting(data);
    return this.getSettingById(data.settingId);
  }
  //#endregion SETTINGS

  //#region THEMES
  async getThemes(): Promise<ThemeDTO[]> {
    return await this._services.getAllThemes();
  }

  async saveTheme(data: ThemeDTO): Promise<ThemeDTO> {
    return await this._services.postTheme(data);
  }
  //#endregion THEMES

  //#region USERS
  async getAllUsers() {
    return await this._services.getAllUsers();
  }

  async getUserById(userId: number) {
    return await this._services.getUserById(userId);
  }

  async getCurrentUser(): Promise<UserDTO> {
    return await this._services.getCurrentUser();
  }

  async saveUser(user: UserDTO) {
    return await this._services.saveUser(user);
  }

  async deleteUser(userId: number) {
    let response = await this._services.deleteUser(userId);
    return response && response.length ? response[0] : null;
  }
  //#endregion USERS

  //#region QUIZ
  async getAllQuizs(): Promise<QuizDTO[]> {
    let response: QuizDTO[] = await this._services.getAllQuizzes();
    return response;
  }

  async getQuizById(quizId: number): Promise<QuizDTO> {
    return await this._services.getQuizById(quizId);
  }

  async getQuizCompleteById(quizId: number): Promise<QuizDTO> {
    return await this._services.getQuizCompleteById(quizId);
  }

  async saveQuiz(quiz: QuizDTO): Promise<QuizDTO> {
    return await this._services.saveQuiz(quiz);
  }

  async deleteQuiz(quizId: number): Promise<QuizDTO> {

    let response = await this._services.deleteQuiz(quizId);
    return response && response.length ? response[0] : null;
  }

  async saveAllQuiz(quiz: QuizDTO): Promise<QuizDTO> {
    // quiz = quiz || this.mockquiz();
    let data = this.prepareQueryAnswersOptions(quiz);

    const responseQuiz: QuizDTO = await this._services.saveQuiz(data.quiz);
    quiz.quizId = responseQuiz.quizId;

    data = this.prepareQueryAnswersOptions(quiz);
    quiz.answers.map(async(answer: AnswerDTO) => {
      const responseAnswer = await this._services.saveAnswer(answer);
      answer.answerId = responseAnswer.answerId;

      answer._options.map(async(option: AnswerOptionDTO) => {
        option.answerId = answer.answerId;
        const responseOption = await this._services.saveAnswerOption(option);

        option.optionId = responseOption.optionId;
      });
    });

    return quiz;
  }

  mockquiz(): QuizDTO {
    return {
      "quizId": -1,
      "title": "Crear Examen",
      "answers": [
        {
          "answerId": 1,
          "quizId": -1,
          "title": "qwdqwdqwdqwdqwd",
          "updatedDate": 1779717585125,
          "_options": [
            {
              "answerId": 1,
              "content": "qwdqwdqwd",
              "optionId": 1,
              "optionIndex": 1,
              "updatedDate": 1779717585125,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 1,
              "content": "qwdqwd",
              "optionId": 2,
              "optionIndex": 2,
              "updatedDate": 1779717588593,
              "isCorrect": false,
              "_selected": true
            },
            {
              "answerId": 1,
              "content": "",
              "optionId": 2,
              "optionIndex": 3,
              "updatedDate": 1779717589533,
              "isCorrect": false,
              "_selected": false
            }
          ]
        },
        {
          "answerId": 2,
          "quizId": -1,
          "title": "qwdqwdqwd",
          "updatedDate": 1779717591456,
          "_options": [
            {
              "answerId": 2,
              "content": "qwdqwdwq",
              "optionId": 1,
              "optionIndex": 1,
              "updatedDate": 1779717591456,
              "isCorrect": false,
              "_selected": true
            },
            {
              "answerId": 2,
              "content": "qwdqwd",
              "optionId": 2,
              "optionIndex": 2,
              "updatedDate": 1779717593579,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 2,
              "content": "",
              "optionId": 2,
              "optionIndex": 3,
              "updatedDate": 1779717595341,
              "isCorrect": false,
              "_selected": false
            }
          ]
        },
        {
          "answerId": 3,
          "quizId": -1,
          "title": "wqdqwdwqd",
          "updatedDate": 1779717597358,
          "_options": [
            {
              "answerId": 3,
              "content": "qwdqwd",
              "optionId": 1,
              "optionIndex": 1,
              "updatedDate": 1779717597359,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 3,
              "content": "qwdqwd",
              "optionId": 2,
              "optionIndex": 2,
              "updatedDate": 1779717598400,
              "isCorrect": false,
              "_selected": true
            },
            {
              "answerId": 3,
              "content": "",
              "optionId": 2,
              "optionIndex": 3,
              "updatedDate": 1779717600211,
              "isCorrect": false,
              "_selected": false
            }
          ]
        },
        {
          "answerId": 4,
          "quizId": -1,
          "title": "wfef",
          "updatedDate": 1779717796181,
          "_options": [
            {
              "answerId": 4,
              "content": "ewfwfwef",
              "optionId": 1,
              "optionIndex": 1,
              "updatedDate": 1779717796181,
              "isCorrect": false,
              "_selected": true
            },
            {
              "answerId": 4,
              "content": "wefwfwe",
              "optionId": 2,
              "optionIndex": 2,
              "updatedDate": 1779717798031,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 4,
              "content": "",
              "optionId": 2,
              "optionIndex": 3,
              "updatedDate": 1779717799403,
              "isCorrect": false,
              "_selected": false
            }
          ]
        },
        {
          "answerId": 5,
          "quizId": -1,
          "title": "wefweffwef",
          "updatedDate": 1779717837001,
          "_options": [
            {
              "answerId": 5,
              "content": "wefwefwe",
              "optionId": 1,
              "optionIndex": 1,
              "updatedDate": 1779717837001,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 5,
              "content": "fwew",
              "optionId": 2,
              "optionIndex": 2,
              "updatedDate": 1779717841570,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 5,
              "content": "efwef",
              "optionId": 2,
              "optionIndex": 3,
              "updatedDate": 1779717842306,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 5,
              "content": "wefwe",
              "optionId": 2,
              "optionIndex": 4,
              "updatedDate": 1779717842814,
              "isCorrect": false,
              "_selected": true
            },
            {
              "answerId": 5,
              "content": "wef",
              "optionId": 2,
              "optionIndex": 5,
              "updatedDate": 1779717843599,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 5,
              "content": "",
              "optionId": 2,
              "optionIndex": 6,
              "updatedDate": 1779717844444,
              "isCorrect": false,
              "_selected": false
            }
          ]
        },
        {
          "answerId": 6,
          "quizId": -1,
          "title": "wefwe",
          "updatedDate": 1779717846937,
          "_options": [
            {
              "answerId": 6,
              "content": "wfwef",
              "optionId": 1,
              "optionIndex": 1,
              "updatedDate": 1779717846937,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 6,
              "content": "wefwef",
              "optionId": 2,
              "optionIndex": 2,
              "updatedDate": 1779717862060,
              "isCorrect": false,
              "_selected": true
            },
            {
              "answerId": 6,
              "content": "wfwefewfewfew",
              "optionId": 2,
              "optionIndex": 3,
              "updatedDate": 1779717863855,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 6,
              "content": "",
              "optionId": 2,
              "optionIndex": 4,
              "updatedDate": 1779717865815,
              "isCorrect": false,
              "_selected": false
            }
          ]
        },
        {
          "answerId": 7,
          "quizId": -1,
          "title": "wdfqddqwd",
          "updatedDate": 1779720933589,
          "_options": [
            {
              "answerId": 7,
              "content": "qwdqwdqw",
              "optionId": 1,
              "optionIndex": 1,
              "updatedDate": 1779720933589,
              "isCorrect": false,
              "_selected": true
            },
            {
              "answerId": 7,
              "content": "qwdqwdqwdqwd",
              "optionId": 2,
              "optionIndex": 2,
              "updatedDate": 1779720945294,
              "isCorrect": false,
              "_selected": false
            },
            {
              "answerId": 7,
              "content": "",
              "optionId": 2,
              "optionIndex": 3,
              "updatedDate": 1779720947400,
              "isCorrect": false,
              "_selected": false
            }
          ]
        }
      ],
      "creationDate": 1779720952856,
      "updatedDate": 1779720952856,
      "time": null
    }
  }

  prepareQueryAnswersOptions(quiz: QuizDTO): {quiz: QuizDTO, answers: AnswerDTO[], answerOptions: AnswerOptionDTO[]} {
    const _quiz: QuizDTO = {
      quizId : quiz.quizId == -1 ? null : quiz.quizId,
      uuid: quiz.uuid || uuidv4(),
      title: quiz.title,
      time: quiz.time || 0,
      creationDate: quiz.creationDate,
      updatedDate: quiz.updatedDate,
      startDate: quiz.startDate || 0,
    };
    const answers = [];
    const answerOptions = [];

    quiz.answers.map(answer => {
      answer.answerId = answer.answerId == -1 ? null : answer.answerId;
      answer.quizId = quiz.quizId;
      if(answer.title != '') {
        answers.push(answer);
      }

      answer._options.map(option => {
        option.answerId = answer.answerId;
        option.optionId = option.optionId == -1 ? null : option.optionId;
        option.isCorrect = option._selected == true;

        if(answer.title != '' || option.content != '') {
          answerOptions.push(option);
        }
      });
    })

    return { quiz: _quiz, answers: answers, answerOptions: answerOptions };
  }
  //#endregion QUIZ

  //#region QUIZ_AWNSWERS
  async getAllAnswers(): Promise<AnswerDTO[]> {
    let response: AnswerDTO[] = await this._services.getAllAnswers();
    return response;
  }

  async getAnswersByQuiz(quizId: number): Promise<AnswerDTO> {
    return await this._services.getAnswersByQuiz(quizId);
  }

  async saveAnswer(data: AnswerDTO): Promise<AnswerDTO> {
    return await this._services.saveAnswer(data);
  }

  async deleteAnswer(id: number): Promise<AnswerDTO> {
    let response = await this._services.deleteAnswer(id);
    return response && response.length ? response[0] : null;
  }
  //#endregion QUIZ_AWNSWERS

  //#region AWNSWERS_OPTIONS
  async getOptionsByAnswer(answerId: number): Promise<AnswerOptionDTO[]> {
    return await this._services.getOptionsByAnswer(answerId);
  }

  async saveAnswerOption(data: AnswerOptionDTO): Promise<AnswerOptionDTO> {
    return await this._services.saveAnswerOption(data);
  }

  async deleteAnswerOption(id: number): Promise<AnswerOptionDTO> {
    let response = await this._services.deleteAnswerOption(id);
    return response && response.length ? response[0] : null;
  }
  //#endregion AWNSWERS_OPTIONS

  //#region QUIZ_ATTEMPS
  async getAttemptsByUser(userId: number): Promise<AttemptDTO[]> {
    return await this._services.getAttemptsByUser(userId);
  }

  async getAttemptById(attemptId: number): Promise<AttemptDTO> {
    return await this._services.getAttemptById(attemptId);
  }

  async saveQuizAttempt(data: AttemptDTO): Promise<AttemptDTO> {
    return await this._services.saveQuizAttempt(data);
  }

  async deleteQuizAttempt(attemptId: number): Promise<AttemptDTO[]> {
    return await this._services.deleteQuizAttempt(attemptId);
  }
  //#endregion QUIZ_ATTEMPS

  //#region AWNSWERS_ATTEMPTS
  async getAnswerAttemptsByAttempt(attemptId: number): Promise<AttemptAnswerDTO[]> {
    return await this._services.getAnswerAttemptsByAttempt(attemptId);
  }

  async saveAnswerAttempt(data: AttemptAnswerDTO): Promise<AttemptAnswerDTO> {
    return await this._services.saveAnswerAttempt(data);
  }
  //#endregion AWNSWERS_ATTEMPTS

  //#region LOGS
  async getAllLogs(): Promise<LogDTO[]> {
    return await this._services.getAllLogs();
  }

  async getLogById(id: number): Promise<LogDTO> {
    const response = await this._services.getLogById(id);
    return response && response.length ? response[0] : null;
  }

  async postLog(data: LogDTO): Promise<LogDTO> {
    return await this._services.postLog(data);
  }

  async deleteLog(id: number): Promise<LogDTO[]> {
    return await this._services.deleteLog(id);
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


  //#region DEFAULT_DATA
  defaultThemeLight: ThemePropertiesDTO = {
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

  defaultThemeDark: ThemePropertiesDTO = {
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

  async setDefaultData(): Promise<SettingsDTO> {
    let settings = await this._services.getSettingCompleteById(0);

    if (!settings) {
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
    return settings;
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
