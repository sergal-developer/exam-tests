import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { AnswerEntity, AttemptEntity, OptionEntity } from 'src/app/shared/data/entities/entities';
import { AttemptState, GradeState } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.html',
  encapsulation: ViewEncapsulation.None,
})
export class QuizComponent implements OnInit {
  @Input() id: string = null;
  @Input() review: boolean = false;

  //#region INTERNAL
  attempt: AttemptEntity = null;
  currentAnswerIndex = 0;
  currentAnswer: AnswerEntity = null;

  readonly = false;
  progress = 0;
  progresStyle = '';
  savingData = false;
  currentSection = 'show';

  _gradeState = GradeState;
  //#endregion INTERNAL

  constructor(private _commonService: CommonServices,
    private _uiService: UiServices
  ) { }

  async ngOnInit() {
    await this.getData();
    this.setupComponent();
  }

  //#region DATA
  async getData() {
    if (this.id) {
      this.attempt = await this.getAttemptData(this.id);

      if (!this.attempt) {
        this._uiService.notification('Ocurrio un error al recuperar los datos', { type: 'error', closeTimer: 3000 });
        return false;
      }
    }
    return true;
  }

  async setupComponent() {
    this.readonly = this.attempt.state == AttemptState.completed;
    this.currentAnswerIndex = 0;
    this.currentAnswer = this.attempt.questions[this.currentAnswerIndex];
    const validAnswers = [];
    this.attempt.questions.map((answer: AnswerEntity) => {
      if (answer.question != '' && answer.correctAnswer) {
        validAnswers.push(answer);
      }
    });
    this.attempt.validTotalAnswers = validAnswers.length;
    this.getProgress();

    if (this.readonly) {
      this.showFinishPage();
    }

    // this.setCurrentAnswer();
  }

  async getAttemptData(id: string) {
    const data = await this._commonService.searchAttempt(id, 'attemptId');
    if (!data) {
      this._uiService.notification('La información no pudo recuperarse correctamente');
      return null;
    }
    return data;
  }

  async updateResults(isFinish = false) {
    if (this.savingData) {
      return;
    }
    this.savingData = true;

    this.getProgress();
    if (this.readonly) { return; }

    if (isFinish) {
      this.attempt.state = AttemptState.completed;
      this.attempt = this.getAssessment();
      this.attempt = this.getGrade();

    } else {
      this.attempt.state = AttemptState.progress;
    }

    this.attempt.updatedDate = new Date().getTime();
    this.readonly = this.attempt.state == AttemptState.completed;

    await this._commonService.updateAttempt(this.attempt.attemptId, this.attempt, 'attemptId');

    if (this.attempt.state == AttemptState.completed) {
      this.showFinishPage();
    }

    this.savingData = false;
  }


  //#endregion DATA

  //#region EVENTS
  selectOption(option: OptionEntity) {
    if (this.readonly) { return; }

    if (option.selected) {
      this.nextAnswer();
    } else {
      // reset all selections
      this.currentAnswer.options.map(opt => {
        opt.selected = opt.id == option.id ? true : false;
      });
    }

    this.currentAnswer.selectedAnswer = option.id;
  }

  prevAnswer() {
    if (this.currentAnswerIndex == 0) {
      return;
    }

    this.currentAnswerIndex = this.currentAnswerIndex - 1;
    this.currentAnswer = this.attempt.questions[this.currentAnswerIndex];
    this.updateResults();
  }

  nextAnswer() {
    if (this.currentAnswerIndex >= this.attempt.validTotalAnswers - 1) {
      return;
    }

    this.currentAnswerIndex = this.currentAnswerIndex + 1;
    this.currentAnswer = this.attempt.questions[this.currentAnswerIndex];
    this.updateResults();
  }

  finishQuiz() {
    if (this.attempt.state == AttemptState.completed) {
      this.showFinishPage();
    }

    this.updateResults(true);
  }

  viewResultsAction() {
    this.finishQuiz();
  }

  getProgress() {
    this.progress = (100 / (this.attempt.validTotalAnswers)) * (this.currentAnswerIndex + 1);
    this.progresStyle = `width: ${this.progress}%`;
  }

  showFinishPage() {
    this.currentSection = 'show_2';
  }

  showQuiz() {
    this.setupComponent();
    this.currentSection = 'show';
  }

  closeResults() {
    this.currentSection = 'show';
  }

  gotoQuestion(index) {
    this.currentAnswerIndex = index - 1;
    this.nextAnswer();
    this.currentSection = 'show';
  }

  gotoDashboard() {
    this._commonService.navigate('dashboard');
  }
  //#endregion EVENTS

  //#region CONVERTERS
  getAssessment() {
    let score = 0;
    const correctAnswers = [];
    const answerTotal = this.attempt.questions.length;
    this.attempt.questions.map((item: AnswerEntity) => {
      item.isCorrect = item.correctAnswer == item.selectedAnswer;
      if (item.isCorrect) {
        correctAnswers.push(item);
      }
    });
    score = (100 / answerTotal) * correctAnswers.length;
    this.attempt.score = score;
    this.attempt.correctAnswers = correctAnswers.length;
    return this.attempt;
  }

  getGrade() {
    const score = this.attempt.score;
    this.attempt.grade = score > 75 ? GradeState.passed :
      score > 60 && score < 75.9 ? GradeState.barely_passed : score > 0 && score < 59.9 ? GradeState.failed : GradeState.failed;

    return this.attempt;
  }
  //#endregion CONVERTERS
}
