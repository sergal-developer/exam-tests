import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, } from '@angular/core';
import { AnswerEntity, AttemptEntity, OptionEntity, QuizEntity } from 'src/app/shared/data/entities/entities';
import { AttemptState } from 'src/app/shared/data/enumerables/enumerables';
import { TransformData } from 'src/app/shared/data/utils/transformData';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  @Output() onChange = new EventEmitter();

  listQuiz: QuizEntity[] = [];
  currentQuiz: QuizEntity = null;
  currentSection = 'show';
  listAttempts: AttemptEntity[] = [];
  uistate = 'init';

  transform = new TransformData();

  constructor(private _commonServices: CommonServices,
    private _uiServices: UiServices) { }

  ngOnInit() {
    
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
  }

  async getAttempts(quiz: QuizEntity) {
    const attempt = await this._commonServices.filterAttempts(quiz.id);
    this.listAttempts = attempt && attempt.length ? this.normalizeAttempt(attempt) : [];
  }

  async createattempt() {
    const data: AttemptEntity = {
      id: this.currentQuiz.id,
      attemptId: uuidv4(),
      score: 0,
      state: AttemptState.new,
      timeEnlapsed: 0,
      title: this.currentQuiz.title,
      questions: this.currentQuiz.questions,
      time: this.currentQuiz.time,
      creationDate: new Date().getTime(),
      updatedDate: new Date().getTime()
    }

    // clean selected elements
    data.questions.map((question: AnswerEntity) => {
      question.options.map((opt: OptionEntity) => {
        opt.selected = false;
      })
    });

    await this._commonServices.saveAttempt(data);
    const attempt = await this._commonServices.searchAttempt(data.attemptId, 'attemptId');

    if (attempt) {
      this.goToCompleteAttempt(attempt);
    } else {
      // GLOBAL.service_error_attempt
      this._uiServices._notification('Ocurrio un error al generar la evaluacion, intente nuvamente', { type: 'error' })
    }
  }

  async deleteQuiz(quiz: QuizEntity) {
    console.log('quiz: ', quiz);
  }
  //#endregion DATA

  //#region EVENTS
  createQuiz() {
    this._commonServices.navigate('quizcreate');
  }

  editQuiz(quiz: QuizEntity) {
    this._commonServices.navigate('quizedit', quiz.id);
  }
  

  goToCompleteAttempt(attempt: AttemptEntity) {
    this._commonServices.navigate('attemptevalue',  attempt.attemptId);
  }

  goToReviewAttempt(attempt: AttemptEntity) {
    this._commonServices.navigate('attemptreview', attempt.attemptId);
  }

  async showDetails(quiz: QuizEntity) {
    this.listQuiz.map((item) => {
      item._current = quiz.id == item.id;
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
  }

  returnMain() {
    this.currentSection = 'show';
    this.listQuiz.map((item) => {
      item._current = false;
    });
    this.currentQuiz = null;
    this.valueChange('primary');
  }

  valueChange(value: string ) {
    this.onChange.emit({ action: 'ui_update', value: value });
  }
  //#endregion EVENTS

  //#region CONVERTERS
  normalizeQuiz(list: QuizEntity[]) {
    list.map((item) => {
      item._status = new Date(item.creationDate).toString();
      item._attemptsValue = item._attemptsValue ?? '-';
      item._bestTimeValue = item._bestTimeValue ?? '-';
    })
    return list;
  }

  normalizeAttempt(list: AttemptEntity[]) {
    list.map((item) => {
      item._creationDate = this.transform.toDate(new Date(item.creationDate), 'MMM/d/yy h:mm');
      item._updatedDate = this.transform.toDate(new Date(item.updatedDate), 'MMM/d/yy h:mm');
    })
    return list;
  }
  //#endregion CONVERTERS
}
