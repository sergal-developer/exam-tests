import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, } from '@angular/core';
import { AttemptAnswerDTO, AttemptDTO, AttemptState, GradeState, QuizAnswerOptionDTO, QuizDTO } from 'src/app/shared/data/entities/dtos';
import { ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.html',
  encapsulation: ViewEncapsulation.None,
})
export class QuizComponent implements OnInit {
  @Input() id: number = null;
  @Input() review: boolean = false;
  @Output() onChange = new EventEmitter();

  //#region INTERNAL
  attempt: AttemptDTO = null;
  currentAnswerIndex = 0;
  currentAnswer: AttemptAnswerDTO = null;

  readonly = false;
  progress = 0;
  progresStyle = '';
  savingData = false;
  currentSection = 'show';

  _gradeState = GradeState;
  gradePassedScore = 75;

  timerStart = null;
  timerEnd = null;
  zoomlevel = '100%';
  zoomlevelLabel = '1.1x';
  settings = null
  
  redirect = { module: ScreenEnum.dashboard, action: '' };
  //#endregion INTERNAL

  constructor(private commonServices: CommonServices,
    private uiServices: UiServices
  ) { }

  async ngOnInit() {
    this.uiServices.showLoader(true);
    this.settings = await this.commonServices.getSettingCompleteById(0);

    await this.getData();
    this.setupComponent();

    setTimeout(() => {
      this.zoomlevel = this.uiServices.getThemeKey('zoomLevel');
      this.zoomlevelLabel = this.getZoomLevel(this.zoomlevel);
      this.uiServices.showLoader(false);
    }, 500);
  }

  //#region DATA
  async getData() {
    if (this.id) {
      this.id = JSON.parse(JSON.stringify(this.id));
      const attempt = await this.getAttemptData(this.id);
      this.attempt = attempt;

      if (this.attempt.state == AttemptState.new) {
        this.attempt.startDate = new Date().getTime();
        this.attempt.state = AttemptState.progress;
      }

      if (this.attempt.state == AttemptState.progress) {
        let idxLastResponse = this.attempt.answers.findIndex((item) => !item.selectedOptionId);
        if (idxLastResponse != -1) {
          idxLastResponse = idxLastResponse == 0 ? 0 : idxLastResponse - 1;
        } else {
          idxLastResponse = this.attempt.answers.length - 1;
        }

        setTimeout(() => {
          this.gotoQuestion(idxLastResponse);
        }, 500);
      }

      if (this.attempt.state == 'completed') {
        this.attempt._score = this.attempt.score.toFixed(2);
        this.showFinishPage();
      }

      this.readonly = this.attempt.state == AttemptState.completed;

      if (!this.attempt) {
        this.uiServices.notification('Ocurrio un error al recuperar los datos', { type: 'error', closeTimer: 3000 });
        return false;
      }

      this.redirect.module = ScreenEnum.dashboard;
      this.redirect.action = `${ this.attempt.quizId }`;
    }
    return true;
  }

  async setupComponent() {
    if (!this.attempt) {
      return;
    }

    // this.readonly = this.attempt.state == AttemptState.completed;
    this.currentAnswerIndex = 0;
    // this.currentAnswer = this.attempt.answers[this.currentAnswerIndex];

    this.getProgress();
    if (this.readonly) {
      this.showFinishPage();
    }
  }

  async getAttemptData(id: number): Promise<AttemptDTO> {
    let attempt: AttemptDTO = await this.commonServices.getAttemptCompleteByAttemptId(id);
    return attempt;
  }

  async updateResults(isFinish = false) {
    if (this.savingData) {
      return;
    }

    if( this.attempt.state == AttemptState.completed) {
      return;
    }

    this.savingData = true;

    this.getProgress();
    if (this.readonly) { return; }

    if (isFinish) {
      this.attempt.state = AttemptState.completed;
      this.attempt = await this.getAssessment();
    } else {
      this.attempt.state = AttemptState.progress;
    }

    this.attempt.updatedDate = new Date().getTime();
    this.readonly = this.attempt.state == AttemptState.completed;
    const reponse = await this.commonServices.saveAllAttempt(this.attempt);
    this.attempt = reponse;

    if (this.attempt.state == AttemptState.completed) {
      this.showFinishPage();
    }

    this.savingData = false;
  }
  //#endregion DATA

  //#region EVENTS
  selectOption(option: QuizAnswerOptionDTO) {
    if (this.readonly) { return; }

    if (option._chosenAnswer) {
      this.nextAnswer();
    } else {
      // reset all selections
      this.currentAnswer.options.map(opt => {
        opt._chosenAnswer = opt.optionId == option.optionId ? true : false;
      });
    }

    this.currentAnswer.selectedOptionId = option.optionId;
  }

  prevAnswer() {
    if (this.currentAnswerIndex == 0) {
      return;
    }

    this.currentAnswerIndex = this.currentAnswerIndex - 1;
    this.currentAnswer = this.attempt.answers[this.currentAnswerIndex];
    this.updateResults();
  }

  nextAnswer() {
    if (this.currentAnswerIndex >= this.attempt.answers.length - 1) {
      return;
    }

    this.currentAnswerIndex = this.currentAnswerIndex + 1;
    this.currentAnswer = this.attempt.answers[this.currentAnswerIndex];
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
    this.progress = (100 / (this.attempt.answers.length)) * (this.currentAnswerIndex + 1);
    this.progresStyle = `width: ${this.progress}%`;
  }

  showFinishPage() {
    this.currentSection = 'show_2';
    this.valueChange('secondary');
  }

  showQuiz() {
    this.setupComponent();
    this.currentSection = 'show';
    this.valueChange('primary');
    this.gotoQuestion(0);
  }

  closeResults() {
    this.currentSection = 'show';
    this.valueChange('primary');
  }

  gotoQuestion(index) {
    this.currentAnswerIndex = index;
    this.getProgress();
    this.currentSection = 'show';
    this.valueChange('primary');
    this.currentAnswer = this.attempt.answers[this.currentAnswerIndex];
  }

  gotoDashboard() {
    this.commonServices.navigate('dashboard');
  }

  valueChange(value: string) {
    this.onChange.emit({ action: 'ui_update', value: value });
  }

  updateZoom() {
    const currentLevel = parseInt(this.zoomlevel.replace('%', ''));
    const increment = 10;
    let lavel = currentLevel <= 160 ? currentLevel + increment :
      currentLevel >= 160 ? 70 + increment : 100;

    this.zoomlevel = `${lavel}%`;
    this.uiServices.applyThemeKey('zoomLevel', this.zoomlevel);
    this.zoomlevelLabel = this.getZoomLevel(this.zoomlevel);

    // this.uiServices.applyTheme(this.settings.themeProps[this.settings.theme.toLowerCase()])
  }

  setZoom() {
    this.uiServices.applyThemeKey('zoomLevel', this.zoomlevel);
  }
  //#endregion EVENTS

  //#region CONVERTERS
  async getAssessment() {

    const reponse = await this.commonServices.saveAllAttempt(this.attempt)
    const attempt = await this.commonServices.evalueAttemptById(reponse.attemptId);
    this.attempt = attempt;
    return this.attempt;
  }

  getZoomLevel(zoomLevel: string) {
    zoomLevel = zoomLevel || "100%";
    const num = parseInt(zoomLevel.replace('%', ''));
    return `${num / 100}x`;
  }
  //#endregion CONVERTERS
}
