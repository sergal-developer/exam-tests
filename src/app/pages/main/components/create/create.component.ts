import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
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
  _examService = new ExamsService();

  constructor(private eventService: EventBusService) { }

  data: any = {};
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
    this.loadExam();
  }

  init() {
    this.loadExam();
  }

  loadExam() {
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
    this.currentQuestionIndex = 0;
    this.updateHeaders();
  }

  updateHeaders() {
    this.data.title = this.currentExam.title;
    this.data.questions = this.currentExam.questionsLenght;
    this.data.color = this.currentExam.color;
    this.data.current = this.currentQuestionIndex + 1;
    this.data.progress = `${(100 / this.currentExam.questionsLenght) * this.data.current}%`;
    this.data.completed = false;

    this.eventService.emit({ name: EVENTS.CONFIG, component: 'subheader', value: this.data });
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
    this.currentExam.attempts = 0;
    this.currentExam.questionsLenght = this.currentExam.questions.length;
    this._examService.saveExams(this.currentExam);

    const exams = this._examService.getExams();
    console.log('exams: ', exams);
  }
  //#endregion ACTIONS
}