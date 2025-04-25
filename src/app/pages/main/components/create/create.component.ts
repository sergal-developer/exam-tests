import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsEntity } from 'src/app/shared/data/entities/entities';
import { EVENTS } from 'src/app/shared/data/enumerables/enumerables';
import { IExam, IOption, IQuestion } from 'src/app/shared/data/interfaces/IExam';
import { IHeader } from 'src/app/shared/data/interfaces/IUI';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { Utils } from 'src/app/shared/data/utils/utils';
import { CommonServices } from 'src/app/shared/services/common.services';
import { MainServices } from '../../main.service';
// import { EventBusService } from 'src/app/shared/data/utils/event.services';

@Component({
  selector: 'create',
  templateUrl: './create.html',
  styleUrls: ['./create.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit {
  @Input() data: any;

  /* This value return any change call into [(ngModel)] */
  private _examTitle: any;
  get examTitle(): any {
    return this._examTitle;
  }

  @Input()
  set examTitle(v: any) {
    if (v !== this._examTitle) {
      this._examTitle = v;
      this.currentExam.title = v;
    }
  }

  _helper = new Utils();

  isEdit = false;
  headerData: any = {};
  currentExam: IExam = {
    title: '',
    color: '',
    questionsLenght: 0,
    questions: []
  };

  currentQuestionIndex = 0;
  currentQuestion: IQuestion = {
    id: 0,
    questions: '',
    answer: null,
    options: [
      { id: 1, text: '' }
    ],
  };
  backgrounds: Array<any> = [];
  screen = 'firstScreen';
  settings: SettingsEntity = null;

  constructor(private _router: Router,
    private eventService: EventBusService,
    private _mainServices: MainServices,
    private _commonServices: CommonServices) { }


  ngOnInit() {
    this.init();
  }

  async init() {
    this.settings = await this._commonServices.getActiveSettings();
    console.log('this.settings : ', this.settings );
    // this.backgrounds = this._helper.shuffleArray(this.settings.colors);

    if (this.data) {
      const examTemp: IExam = await this._commonServices.searchExamn(this.data.id);
      console.log('examTemp: ', examTemp);
      this.loadExam(examTemp);
    } else {
      this.loadExam();
    }
  }

  loadExam(exam?: IExam) {
    this.isEdit = false;

    if (exam) {
      this.currentExam = exam;
      this.currentQuestion = this.currentExam.questions[0];
      this.isEdit = true;
    } else {
      this.currentExam = {
        title: 'Titulo',
        color: this.backgrounds[0],
        questionsLenght: 1,
        questions: [],
        time: 0
      };
      this.currentExam.questions.push({
        id: 1,
        questions: '',
        answer: null,
        options: [
          { id: 1, text: '' }
        ],
      });
    }
    this.currentQuestionIndex = 0;

    console.log('this.currentExam: ', this.currentExam);
    this.updateHeaders();
  }

  updateHeaders(props?: { hide: boolean }) {
    const type = props && props.hide ? 'hide' : 'progress'

    const current = this.currentQuestionIndex + 1;
    const progress = `${(100 / this.currentExam.questionsLenght) * current}%`;
    // const background = `background: ${ this.currentExam.color }`;
    const background = `background: #fff`;
    const time = this.currentExam.time ? `${this.currentExam.time} min.` : '';
    const header: IHeader = {
      type: type,
      title: this.currentExam.title,
      headerClass: '',
      mainClass: '',
      mainStyle: background,
      canEditTitle: true,
      exam: {
        color: this.currentExam.color,
        completed: false,
        current: current,
        progress: progress,
        questionsLenght: this.currentExam.questionsLenght,
        time: this.currentExam.time,
        autoStartTimer: false
      }
    }

    this.eventService.emit({ name: EVENTS.CONFIG, component: 'header', value: header });
  }

  validate() {
    const question = this.currentQuestion.questions || '';
    const options = this.currentQuestion.options.length;
    const answer = this.currentQuestion.answer;

    return question.trim() && options && answer;
  }

  //#region ACTIONS
  newOption() {
    const countOptions = this.currentQuestion.options.length;
    this.currentQuestion.options.push({ id: countOptions + 1, text: '' });

    this.currentExam.questions[this.currentQuestionIndex] = this.currentQuestion;
  }

  deleteOption(option: IOption) { }
  setCorrectOption(option: IOption) {
    this.currentQuestion.answer = option.id;
  }

  prevQuestion() {
    if (this.currentQuestionIndex == 0) {
      return;
    }
    this.currentQuestionIndex = this.currentQuestionIndex - 1;
    this.currentQuestion = this.currentExam.questions[this.currentQuestionIndex];

    this.updateHeaders();
  }

  nextQuestion() {
    this.currentQuestionIndex = this.currentQuestionIndex + 1;

    if (this.currentQuestionIndex > this.currentExam.questions.length - 1) {
      this.currentExam.questions.push({
        id: this.currentExam.questions.length + 1,
        questions: '',
        answer: null,
        options: [
          { id: 1, text: '' }
        ],
      });
      this.currentExam.questionsLenght = this.currentExam.questions.length;
    }
    this.currentQuestion = this.currentExam.questions[this.currentQuestionIndex];
    this.updateHeaders();
  }

  saveExam() {
    if (!this.isEdit) {
      this.currentExam.attempts = 0;
    }

    this.currentExam.questions = this.currentExam.questions.filter((x: IQuestion) => x.answer != null);
    this.currentExam.questionsLenght = this.currentExam.questions.length;

    this._commonServices.saveExamn(this.currentExam);

    this._mainServices.notification('Examen guardado con exito', { type: 'info', closeTimer: 2000 });
    const exams = this._commonServices.getAllExamns();

    setTimeout(() => {
      this.gotoDashboard();
    }, 1000);
  }

  gotoDashboard() {
    this._router.navigate([`/dashboard`]);
  }

  gotoQuestions() {
    this.screen = 'firstScreen';
    setTimeout(() => {
      this.updateHeaders();
    }, 500);
  }

  gotoConfig(module?: string) {
    this.updateHeaders({ hide: true });
    this.screen = 'secondScreen';
  }

  selectColor(color: string) {
    try {
      this.currentExam.color = color;
      console.log('this.currentExam.color: ', this.currentExam.color);
      this.updateHeaders({ hide: true });

    } catch (error) {
      console.warn('selectColor-error: ', error);
    }
  }
  //#endregion ACTIONS

  ngChange(evt: any) {
    this.currentQuestion.questions = evt.target.innerText;
  }
}