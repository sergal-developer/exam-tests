import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { IExam, IOption, IQuestion } from 'src/app/shared/data/interfaces/IExam';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ExamsService } from 'src/app/shared/services/exams.service';
import { MainServices } from '../../main.service';
import { IHeader } from 'src/app/shared/data/interfaces/IUI';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { Utils } from 'src/app/shared/data/utils/utils';
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

  _examService = new ExamsService();
  _profileService = new ProfileService();
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
  settings: any = null;

  constructor(private _router: Router, 
            private eventService: EventBusService,
            private _mainServices: MainServices) {}


  ngOnInit() {
    this.settings = this._profileService.getSettings();
    this.backgrounds = this._helper.shuffleArray(this.settings.colors);

    if(this.data) {
      const examTemp: Array<IExam> = this._examService.getExamById(this.data.id);
      this.loadExam(examTemp[0]);
    } else {
      this.loadExam();
    }
  }

  loadExam(exam?: IExam) {
    this.isEdit = false;

    if(exam) {
      this.currentExam = exam;
      this.currentQuestion = this.currentExam.questions[0];
      this.isEdit = true;
    } else {
      this.currentExam = {
        title: 'Crear Examen',
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
    this.updateHeaders();
  }

  updateHeaders(props?: { hide: boolean }) {
    const type = props && props.hide ? 'hide' : 'progress'

    const current = this.currentQuestionIndex + 1;
    const progress = `${(100 / this.currentExam.questionsLenght) * current }%`;
    const background = `background: ${ this.currentExam.color }`;
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
        current: current  ,
        progress: progress,
        questionsLenght: this.currentExam.questionsLenght,
        time: ''
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

  deleteOption(option: IOption) {}
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
   

    if(!this.isEdit) {
      this.currentExam.attempts = 0;
    }

    this.currentExam.questions = this.currentExam.questions.filter((x: IQuestion) => x.answer != null);
    this.currentExam.questionsLenght = this.currentExam.questions.length;
    
    this._examService.saveExam(this.currentExam);

    this._mainServices.notification('Examen guardado con exito', { type: 'info', closeTimer: 2000 });
    const exams = this._examService.getExams();

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
}