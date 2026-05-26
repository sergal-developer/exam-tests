import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, } from '@angular/core';
import { AnswerDTO, PermissionsDTO, AttemptDTO, QuizDTO, UserDTO } from 'src/app/shared/data/entities/dtos';
import { AttemptState } from 'src/app/shared/data/enumerables/enumerables';
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
  permissions = {
    create: false,
    duplicate: false,
    edit: false,
    delete: false,
    ai: false
  }

  constructor(private _commonServices: CommonServices,
    private _uiServices: UiServices) { }

  async ngOnInit() {
    await this.getSettings();

    setTimeout(() => {
      this.uistate = '';
      this.init();
    }, 800);

  }

  //#region DATA
  async init() {
    const list = await this._commonServices.getAllQuizs();
    if(list) {
      this.listQuiz = this.normalizeQuiz(list);
    }

    if (this.selected) {
      const quiz = this.listQuiz.find((quiz) => quiz.quizId == this.selected);
      if(this.listQuiz.length && quiz) {
        this.showDetails(quiz);
      }
    }
  }

  async getSettings() {
    const settings = await this._commonServices.setDefaultData();
    this.user = await this._commonServices.getCurrentUser();
    this.permissions = settings.permissions as PermissionsDTO;
  }

  async getAttempts(quiz: QuizDTO) {
    // const attempt = await this._commonServices.filterAttempts(quiz.quizId);
    // this.listAttempts = attempt && attempt.length ? this.normalizeAttempt(attempt) : [];
  }

  async createattempt() {
    const data: AttemptDTO = {
      attemptId: 0,
      quizId: this.currentQuiz.quizId,
      userId: this.user.userId,
      score: 0,
      state: AttemptState.new,
      timeEnlapsed: 0, 
      title: this.currentQuiz.title,
      answers: [],
      creationDate: new Date().getTime(),
      updatedDate: new Date().getTime(),
      // answers: this.currentQuiz.answers,
      // time: this.currentQuiz.time ? this.currentQuiz.time : 0,
      // creationDate: new Date().getTime(),
      // updatedDate: new Date().getTime(),
      // startDate: null
    }

    // DISCART INVALID ANSWERS
    // data.answers = this.validateQuestions(data.answers);
    data.validTotalAnswers = data.answers.length;

    // clean selected elements
    // data.questions.map((question: AnswerEntity) => {
    //   question.options.map((opt: OptionEntity) => {
    //     opt.selected = false;
    //   })
    // });

    // SHUFFLE ANSWERS
    // data.questions = this.transform.shuffleArray(data.questions);

    // SAVE DATA
    // await this._commonServices.saveAttempt(data);
    // const attempt = await this._commonServices.searchAttempt(data.attemptId, 'attemptId');

    // if (attempt) {
    //   this.goToCompleteAttempt(attempt);
    // } else {
    //   // GLOBAL.service_error_attempt
    //   this._uiServices._notification('Ocurrio un error al generar la evaluacion, intente nuvamente', { type: 'error' })
    // }
  }

  async deleteQuiz(quiz: QuizDTO) {
    this.listAttempts.map(async(attemp) => {
      // await this._commonServices.deleteAttempt(attemp.id);
    });
    // await this._commonServices.deleteQuiz(quiz.id);
    this.init();
    this.returnMain();
  }

  async resetAttemps(quiz: QuizDTO) {
    this.listAttempts.map(async(attemp) => {
      // await this._commonServices.deleteAttempt(attemp.id);
    });
    this.returnMain();
  }
  //#endregion DATA

  //#region EVENTS
  createQuiz() {
    this._commonServices.navigate('quizcreate');
  }

  editQuiz(quiz: QuizDTO) {
    this._commonServices.navigate('quizedit', quiz.quizId.toString());
  }

  duplicateQuiz(quiz: QuizDTO) {
    console.info('quiz: ', quiz);
    // this._commonServices.navigate('quizedit', quiz.id);
  }
  

  goToCompleteAttempt(attempt: AttemptDTO) {
    this._commonServices.navigate('attemptevalue',  attempt.attemptId.toString());
  }

  goToReviewAttempt(attempt: AttemptDTO) {
    this._commonServices.navigate('attemptreview', attempt.attemptId.toString());
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
    this._commonServices.navigate('dashboard', this.currentQuiz.quizId.toString());
  }

  returnMain() {
    this.currentSection = 'show';
    this.listQuiz.map((item) => {
      item._current = false;
    });
    this.currentQuiz = null;
    this.valueChange('primary');

    this._commonServices.navigate('dashboard');
  }

  valueChange(value: string ) {
    this.onChange.emit({ action: 'ui_update', value: value });
  }
  //#endregion EVENTS

  //#region CONVERTERS
  normalizeQuiz(list: QuizDTO[]) {
    list.map((item) => {
      item._attemptsValue = item._attemptsValue ?? '-';
      item._bestTimeValue = item._bestTimeValue ?? '-';

      item._creationDate = this.transform.toDate(new Date(item.creationDate), 'MMM/d/yy h:mm a');
      item._updatedDate = this.transform.toDate(new Date(item.updatedDate), 'MMM/d/yy h:mm a');
    })
    return list;
  }

  normalizeAttempt(list: AttemptDTO[]) {
    list.map((item) => {
      item._creationDate = this.transform.toDate(new Date(item.creationDate), 'MMM/d/yy h:mm');
      item._updatedDate = this.transform.toDate(new Date(item.updatedDate), 'MMM/d/yy h:mm');
    })
    return list;
  }

  validateQuestions(list: AnswerDTO[]) {
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
