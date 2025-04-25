import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { EVENTS } from 'src/app/shared/data/enumerables/enumerables';
import { IExam, IOption, IQuestion } from 'src/app/shared/data/interfaces/IExam';
import { IHeader } from 'src/app/shared/data/interfaces/IUI';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { Utils } from 'src/app/shared/data/utils/utils';
import { CommonServices } from 'src/app/shared/services/common.services';
import { MainServices } from '../../main.service';

@Component({
  selector: 'exam',
  templateUrl: './exam.html',
  styleUrls: ['./exam.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExamComponent implements OnInit {
  @Input() data: any;

  _helper = new Utils();
  
  constructor(
    private _router: Router,
    private eventService: EventBusService,
    private _mainServices: MainServices,
    private _commonServices: CommonServices) { }

  timer = 0;
  timeEnlapsed = 0;
  timerFormated = '';
  interval: any;

  currentExam: IExam = {
    title: '',
    color: '',
    questionsLenght: 0,
    questions: []
  };
  questions: Array<IQuestion> = [];

  completeQuestionarie = false;

  currentQuestionIndex = -1;
  currentQuestion: any = null;
  waitingTimeToNext = 500;

  score: any = null;
  scoreResume = {
    correct: 0,
    total: 0,
    score: 0,
    time: '0',
  }

  pageState = 'enterAnim';
  backgrounds: Array<any> = [];
  screen = 'firstScreen';
  settings: any = null;

  ngOnInit() {
    this.init();
  }

  async init() {
    this.settings = await this._commonServices.getActiveSettings();
    this.backgrounds = this.settings.colors;

    if(this.data) {
      const examTemp: IExam = await this._commonServices.searchExamn(this.data.id);
      this.loadExam(examTemp);
    } else {
      // this.loadExam();
      this._mainServices.notification('Examen no se logro cargar', { type: 'warning', closeTimer: 2000 });
    }
  }

  loadExam(exam: IExam) {
    this.score = null;
    this.scoreResume = {
      correct: 0,
      total: 0,
      score: 0,
      time: '0',
    }
    this.currentQuestion = null;
    this.currentExam = {
      title: '',
      color: this.backgrounds[0],
      questionsLenght: 0,
      questions: [],
      time: 0
    };

    this.currentExam = JSON.parse(JSON.stringify(exam));
    this.currentQuestionIndex = 0;

    this.currentExam.questions = this._helper.shuffleArray(this.currentExam.questions);

    this.currentExam.questions.map((question: IQuestion) => {
      question.selectedAnswer = null;
      question.isEvaluated = false;
      question.questions = this._helper.formatText(question.questions);
      question.options.map(op => {
        op.selected = false;
        op.correctAnswer = null;
        op.text = this._helper.formatText(op.text);
      });

      this.questions.push(question);
    });
    this.currentExam.questionsLenght = this.currentExam.questions.length;

    this.currentQuestionIndex = 0;
    this.currentQuestion = this.questions[this.currentQuestionIndex];

    this.startTimers();
    this.updateHeaders();

    // This section is only test for score
    // setTimeout(() => {
    //   // this.currentQuestionIndex = this.currentExam.questions.length;
    //   // this.currentQuestion = null

    //   this.completeQuiz();
    // }, 5000);


    setTimeout(() => {
      this.pageState = '';
    }, 1500);
  }

  updateHeaders(props?: { hide: boolean }) {
    const type = props && props.hide ? 'hide' : 'progress';

    const current = this.currentQuestionIndex + 1;
    const progress = `${(100 / this.currentExam.questionsLenght) * current }%`;
    // const background = `background: ${ this.currentExam.color }`;
    const background = this.currentExam.completed ? `background: rgb(50, 168, 84);` : `background: #fff`;
    // const autoStartTimer = this.currentExam.completed ? false : true;
    const autoStartTimer = this.startTimer;

    const header: IHeader = {
      type: this.currentExam.completed ? 'hide' : 'progress',
      title: this.currentExam.title,
      headerClass: '',
      mainClass: '',
      mainStyle: background,
      canEditTitle: false,
      exam: {
        color: this.currentExam.color,
        completed: false,
        current: current  ,
        progress: progress,
        questionsLenght: this.currentExam.questionsLenght,
        time: this.currentExam.time,
        autoStartTimer: autoStartTimer
      }
    }

    this.eventService.emit({ name: EVENTS.CONFIG, component: 'header', value: header });
  }

  startTimers() {
    const minutes = 1000 * 60 * this.timer;

    this.timeEnlapsed = 0;
    this.interval = setInterval(() => {
      if(this.timer) {
        if (this.timeEnlapsed >= minutes) {
          this.timerFormated = 'Finished.'
          clearInterval(this.interval);
          this.interval = null;
          return;
        }
      }
      
      this.timeEnlapsed = this.timeEnlapsed + 1000;

      let  miliseconds = 0;

      if(this.timer) {
        miliseconds = minutes - this.timeEnlapsed;
      } else {
        miliseconds = this.timeEnlapsed;
      }
      
      let _minutes = Math.floor(miliseconds / 60000);
      let _seconds = ((miliseconds % 60000) / 1000);
      this.timerFormated = `${_minutes < 10 ? '0' + _minutes : _minutes}:${_seconds < 10 ? '0' + _seconds.toFixed(0) : _seconds}`;

      // if(this.currentExam.time && !this.currentExam.completed){
      //   this.updateHeaders();
      // }
    }, 1000);
  }


  startTimer = true;
  nextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      return;
    }

    this.saveTemporalState();
    this.evalueQuestion((response: boolean) => {
      this.currentQuestionIndex = this.currentQuestionIndex + 1;
      this.currentQuestion = this.questions[this.currentQuestionIndex];

      this.startTimer = !this.startTimer;
      if (this.currentQuestionIndex > this.questions.length - 1) {
        this.completeQuiz();
      } else {
        this.updateHeaders();
      }
    });
  }

  prevQuestion() {
    if (this.currentQuestionIndex == 0) {
      return;
    }
    this.currentQuestionIndex = this.currentQuestionIndex - 1;
    this.currentQuestion = this.questions[this.currentQuestionIndex];

    this.updateHeaders();
  }

  selectOption(option: any) {
    if (this.questions[this.currentQuestionIndex].isEvaluated) {
      return;
    }

    if(option.selected) {
      this.nextQuestion();
    }

    this.questions[this.currentQuestionIndex].options.map((op: IOption) => {
      op.selected = false;
    });
    option.selected = true;
    this.questions[this.currentQuestionIndex].selectedAnswer = option.id;
  }

  evalueQuestion(response: Function) {
    if (!this.questions[this.currentQuestionIndex].selectedAnswer) {
      response(false);
    }

    if (this.questions[this.currentQuestionIndex].isEvaluated) {
      response(true);
      return;
    }

    const selectedAnswer = this.questions[this.currentQuestionIndex].selectedAnswer || 0;
    this.questions[this.currentQuestionIndex].correctAnswer =
      this.questions[this.currentQuestionIndex].selectedAnswer == this.questions[this.currentQuestionIndex].answer;
    // get option selected
    const option = this.questions[this.currentQuestionIndex].options[selectedAnswer - 1];
    option.correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;

    this.questions[this.currentQuestionIndex].isEvaluated = true;
    setTimeout(() => {
      response(true);
    }, this.waitingTimeToNext);
  }

  async completeQuiz() {
    this.currentExam.completed = true;
   
    const score = this.getScoreExam();

    // this._examService.saveExams(this.currentExam)
    this.updateHeaders();

    this.currentExam.score = score;
    this.currentExam.attempts = this.currentExam.attempts ? this.currentExam.attempts + 1 : 1;
    this.currentExam.timeEnlapsed = this.timeEnlapsed;
    this.currentExam.completed = false;
    await this._commonServices.updateExamn(this.currentExam.id, this.currentExam);

    const exams = await this._commonServices.getAllExamns();
    console.log('exams: ', exams);
  }

  getScoreExam() {
    const correct = []
    const total = this.currentExam.questions.length;
    this.currentExam.questions.map((q: IQuestion) => {
      q.correctAnswer = q.selectedAnswer === q.answer;
      if (q.correctAnswer) {
        correct.push(q);
      }
    });

    const score =  correct.length === 0 ? 0 :  (correct.length * 100) / total ;

    this.score = parseInt(`${ score }`);
    this.scoreResume = {
      correct: correct.length,
      total: this.questions.length,
      score: this.score,
      time: this.timerFormated
    }
    return this.score;
  }

  repeatExam() {
    this.currentExam.completed = false;
    this.questions = [];
    this.completeQuestionarie = false;
    this.ngOnInit();
  }

  closeExam() {
    this._router.navigate( [`/dashboard`]);
  }


  //#region SAVE TEMPORAL
  saveTemporalState() {
    console.log('this.currentExam: ', this.currentExam);
  }
  //#endregion SAVE TEMPORAL
}
