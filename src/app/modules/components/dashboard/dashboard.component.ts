import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QuizAnswerDTO, PermissionsDTO, AttemptDTO, QuizDTO, UserDTO, AttemptState, SettingsDTO } from 'src/app/shared/data/entities/dtos';
import { TransformData } from 'src/app/shared/data/utils/transformData';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  @Output() onChange = new EventEmitter();
  @Input() selected: number = null;

  listQuiz: QuizDTO[] = [];
  currentQuiz: QuizDTO = null;
  currentSection = 'show';
  listAttempts: AttemptDTO[] = [];
  uistate = 'init';

  transform = new TransformData();
  user: UserDTO = null;
  settings: SettingsDTO = null;
  permissions = {
    create: false,
    duplicate: false,
    edit: false,
    delete: false,
    ai: false
  }

  translateLabels = {
    attempt_error_generation: '',
  };

  constructor(private commonServices: CommonServices,
    private uiServices: UiServices,
    private translate: TranslateService) { }

  async ngOnInit() {
    this.uiServices.showLoader(true);
    this.setupLanguage(async () => {
      setTimeout(() => {
        this.uistate = '';
        this.init();
      }, 800);
    });

  }

  async setupLanguage(next) {
    this.settings = await this.commonServices.getCurrentSettings();
    this.user = await this.commonServices.getCurrentUser();
    this.permissions = this.settings.permissions as PermissionsDTO;

    this.translate.setDefaultLang(this.settings.language);
    const keys = Object.keys(this.translateLabels);
    this.translate.get(keys).subscribe((res) => {
      this.translateLabels = res;
      next();
    });
  }

  //#region DATA
  async init() {
    this.uiServices.showLoader(true);
    const list = await this.commonServices.getAllQuizs();
    if (list) {
      this.listQuiz = list;
    }

    if (this.selected) {
      const quiz = this.listQuiz.find((quiz) => quiz.quizId == this.selected);
      if (this.listQuiz.length && quiz) {
        this.showDetails(quiz);
      }
    }

    this.uiServices.showLoader(false);
  }

  async getAttempts(quiz: QuizDTO) {
    const attempts = await this.commonServices.getAttemptByQuizId(quiz.quizId);
    this.listAttempts = attempts && attempts.length ? this.normalizeAttempt(attempts) : [];
  }

  async createattempt() {
    const attempt = await this.commonServices.createAttempt(this.currentQuiz.quizId);
    if (attempt) {
      this.uiServices.notification(`Examen Duplicado correctamente`, { type: 'info', closeTimer: 3000 });
      this.goToCompleteAttempt(attempt);
    } else {
      this.uiServices.notification(this.translateLabels.attempt_error_generation, { type: 'error' })
    }

    const data: AttemptDTO = {
      attemptId: null,
      quizId: this.currentQuiz.quizId,
      userId: this.user.userId,
      title: this.currentQuiz.title,
      updatedDate: new Date().getTime(),
      startDate: null,
      score: 0,
      state: AttemptState.new,
      time: 0,
      answersLinked: this.currentQuiz.answers ? JSON.stringify(this.currentQuiz.answers) : '',
    }

    // SHUFFLE ANSWERS
    // data.questions = this.transform.shuffleArray(data.questions);

    // SAVE DATA
    // const attempt = await this.commonServices.saveAllQuizAttempt(data);

    // if (attempt) {
    //   this.goToCompleteAttempt(attempt);
    // } else {
    //   // GLOBAL.service_error_attempt
    //   this.uiServices.notification('Ocurrio un error al generar la evaluacion, intente nuvamente', { type: 'error' })
    // }
  }

  async resetAttemps(quiz: QuizDTO) {
    await Promise.all(
      this.listAttempts.map(async (attemp) => {
        await this.commonServices.deleteQuizAttempt(attemp.attemptId);
      })
    );

    this.returnMain();
  }
  //#endregion DATA

  //#region EVENTS
  createQuiz() {
    this.commonServices.navigate('quizcreate');
  }

  editQuiz(quiz: QuizDTO) {
    this.commonServices.navigate('quizedit', quiz.quizId.toString());
  }

  async duplicateQuiz(quiz: QuizDTO) {
    const quizData = await this.commonServices.duplicateQuiz(quiz.quizId);
    if (quizData) {
      this.uiServices.notification(`Examen Duplicado correctamente`, { type: 'info', closeTimer: 3000 });
      this.commonServices.navigate('quizedit', `${quizData.quizId}`);
    }
  }

  async deleteQuiz(quiz: QuizDTO) {
    const _quiz = await this.commonServices.deleteQuiz(quiz.quizId);
    if (_quiz) {
      this.uiServices.notification(`Examen Eliminado correctamente`, { type: 'success', closeTimer: 3000 });
      this.init();
      this.returnMain();
    }
  }


  goToCompleteAttempt(attempt: AttemptDTO) {
    this.commonServices.navigate('attemptevalue', attempt.attemptId.toString());
  }

  goToReviewAttempt(attempt: AttemptDTO) {
    this.commonServices.navigate('attemptreview', attempt.attemptId.toString());
  }

  async showDetails(quiz: QuizDTO) {
    this.listQuiz.map((item) => {
      item._current = quiz.quizId == item.quizId;
    });
    this.currentSection = 'show_2';
    this.currentQuiz = quiz;
    this.getAttempts(this.currentQuiz);

    document.querySelector('.wrapper ').scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.valueChange('secondary');
    this.commonServices.navigate('dashboard', this.currentQuiz.quizId.toString());
  }

  returnMain() {
    this.currentSection = 'show';
    this.listQuiz.map((item) => {
      item._current = false;
    });
    this.currentQuiz = null;
    this.valueChange('primary');

    this.commonServices.navigate('dashboard');
  }

  valueChange(value: string) {
    this.onChange.emit({ action: 'ui_update', value: value });
  }
  //#endregion EVENTS

  //#region CONVERTERS
  normalizeAttempt(list: AttemptDTO[]) {
    list.map((item) => {
      item._startDate = this.transform.toDate(new Date(item.startDate), 'MMM/d/yy h:mm');
      item._updatedDate = this.transform.toDate(new Date(item.updatedDate), 'MMM/d/yy h:mm');
    })
    return list;
  }

  validateQuestions(list: QuizAnswerDTO[]) {
    const validAnswers = [];
    list.map((answer) => {
      if (answer.title != '' && answer._selectedAnswer != null) {
        validAnswers.push(answer);
      }
    });
    return validAnswers;
  }
  //#endregion CONVERTERS
}
