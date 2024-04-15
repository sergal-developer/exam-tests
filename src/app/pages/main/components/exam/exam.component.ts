import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { EVENTS } from 'src/app/shared/data/enumerables/enumerables';
import { IExam, IOption, IQuestion } from 'src/app/shared/data/interfaces/IExam';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
import { ExamsService } from 'src/app/shared/services/exams.service';
import { MainServices } from '../../main.service';
import { Helpers } from 'src/app/shared/services/common/helpers';

@Component({
  selector: 'exam',
  templateUrl: './exam.html',
  styleUrls: ['./exam.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExamComponent implements OnInit {
  @Input() data: any;

  _examService = new ExamsService();
  _helper = new Helpers();
  
  constructor(
    private _router: Router,
    private eventService: EventBusService,
    private _mainServices: MainServices) { }

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

  ngOnInit() {
    if(this.data) {
      const examTemp: Array<IExam> = this._examService.getExamById(this.data.id);
      this.loadExam(examTemp[0]);
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
      color: '',
      questionsLenght: 0,
      questions: []
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
    console.log('this.currentQuestionIndex: ', this.currentQuestionIndex);
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    console.log('this.currentQuestion: ', this.currentQuestion);

    this.startTimers();
    this.updateHeaders();

    // This section is only test for score
    // setTimeout(() => {
    //   // this.currentQuestionIndex = this.currentExam.questions.length;
    //   // this.currentQuestion = null

    //   this.completeQuiz();
    // }, 5000);

    
  }

  updateHeaders() {
    this.data.title = this.currentExam.title;
    this.data.questions = this.currentExam.questionsLenght;
    this.data.color = this.currentExam.color;
    this.data.current = this.currentQuestionIndex + 1;
    this.data.progress = `${(100 / this.currentExam.questionsLenght) * this.data.current}%`;
    this.data.completed = this.currentExam.completed;

    this.eventService.emit({ name: EVENTS.CONFIG, component: 'subheader', value: this.data });
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
    }, 1000);

    // console.log('this.interval: ', this.interval);
  }

  nextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      return;
    }

    this.saveTemporalState();
    this.evalueQuestion((response: boolean) => {
      this.currentQuestionIndex = this.currentQuestionIndex + 1;
      this.currentQuestion = this.questions[this.currentQuestionIndex];

      if (this.currentQuestionIndex > this.questions.length - 1) {
        this.completeQuiz();
      }

      this.updateHeaders();
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

  completeQuiz() {
    this.currentExam.completed = true;
    clearInterval(this.interval);
    this.interval = null;
    const score = this.getScoreExam();

    // this._examService.saveExams(this.currentExam)
    this.updateHeaders();

    this.currentExam.score = score;
    this.currentExam.attempts = this.currentExam.attempts ? this.currentExam.attempts + 1 : 1;
    this.currentExam.timeEnlapsed = this.timeEnlapsed;
    this.currentExam.completed = false;
    this._examService.saveExam(this.currentExam);

    const exams = this._examService.getExams();

    console.log('this.exams: ', exams);
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
    // this.eventService.emit({ name: EVENTS.CONFIG, component: 'reset', value: ScreenEnum.dashboard });
  }


  //#region SAVE TEMPORAL
  saveTemporalState() {
    console.log('this.currentExam: ', this.currentExam);
  }
  //#endregion SAVE TEMPORAL
}
