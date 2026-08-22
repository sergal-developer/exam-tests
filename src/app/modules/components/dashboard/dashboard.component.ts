import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, } from '@angular/core';
import { QuizAnswerDTO, PermissionsDTO, AttemptDTO, QuizDTO, UserDTO } from 'src/app/shared/data/entities/dtos';
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
    const settings = await this._commonServices.saveDefaultData();
    this.user = await this._commonServices.getCurrentUser();
    this.permissions = settings.permissions as PermissionsDTO;
  }

  async getAttempts(quiz: QuizDTO) {
    const attempts = await this._commonServices.getAttemptByQuizId(quiz.quizId);
    console.log('attempt: ', attempts);
    this.listAttempts = attempts && attempts.length ? this.normalizeAttempt(attempts) : [];
  }

  async createattempt() {
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
    // const attempt = await this._commonServices.saveAllQuizAttempt(data);
    // console.log('attempt: ', attempt);

    // if (attempt) {
    //   this.goToCompleteAttempt(attempt);
    // } else {
    //   // GLOBAL.service_error_attempt
    //   this._uiServices.notification('Ocurrio un error al generar la evaluacion, intente nuvamente', { type: 'error' })
    // }
  }

  async deleteQuiz(quiz: QuizDTO) {
    console.log('quiz: ', quiz);
    await this._commonServices.deleteQuiz(quiz.quizId);
    this.init();
    this.returnMain();
  }

  async resetAttemps(quiz: QuizDTO) {
    await Promise.all(
      this.listAttempts.map(async(attemp) => {
        await this._commonServices.deleteQuizAttempt(attemp.attemptId);
      })
    );
    
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

  async duplicateQuiz(quiz: QuizDTO) {
    const quizData = await this._commonServices.getQuizCompleteById(quiz.quizId);
    // prepare data to save as nre record
    quizData.quizId = null;
    quizData.title = `${ quizData.title } - Duplicated`;
    quizData.answers.forEach(answer => {
      answer.answerId = null;
      answer.options.forEach(option => {
        option.optionId = null;
      })
    });
    console.log('quizData: ', quizData);
    const quizNew = await this._commonServices.saveAllQuiz(quizData);
    console.log('quizNew: ', quizNew);
    this._commonServices.navigate('quizedit', `${ quizNew.quizId }`);
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
