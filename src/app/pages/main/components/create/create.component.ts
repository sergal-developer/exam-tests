import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { IExam, IOption, IQuestion } from 'src/app/shared/data/interfaces/IExam';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ExamsService } from 'src/app/shared/services/exams.service';
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
          console.log('this.currentExam: ', this.currentExam);
      }
  }

  _examService = new ExamsService();
  isEdit = false;

  constructor(private _router: Router, 
            private eventService: EventBusService) { }

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

  ngOnInit() {
    if(this.data) {
      const examTemp: Array<IExam> = this._examService.getExamById(this.data.id);
      console.log('examTemp: ', examTemp);
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
        color: 'gray',
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

  updateHeaders() {
    this.headerData.title = this.currentExam.title;
    this.headerData.questions = this.currentExam.questionsLenght;
    this.headerData.color = this.currentExam.color;
    this.headerData.current = this.currentQuestionIndex + 1;
    this.headerData.progress = `${(100 / this.currentExam.questionsLenght) * this.headerData.current}%`;
    this.headerData.completed = false;
    this.headerData.canEditTitle = true;

    this.eventService.emit({ name: EVENTS.CONFIG, component: 'subheader', value: this.headerData });
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
    this.currentExam.questionsLenght = this.currentExam.questions.length;

    if(!this.isEdit) {
      this.currentExam.attempts = 0;
    }

    this._examService.saveExams(this.currentExam);

    const exams = this._examService.getExams();

    this.gotoDashboard();
  }

  gotoDashboard() {
    this._router.navigate([`/dashboard`]);
  }
  //#endregion ACTIONS
}