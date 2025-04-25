import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerEntity, OptionEntity, QuizEntity } from 'src/app/shared/data/entities/entities';
import { CommonServices } from 'src/app/shared/services/common.services';
import { UiServices } from 'src/app/shared/services/ui.services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'quiz-editable',
  templateUrl: './quiz-editable.html',
  encapsulation: ViewEncapsulation.None,
})
export class QuizEditableComponent implements OnInit {
  @Input() quizId: string = null;

  //#region INTERNAL
  form: FormGroup;
  formQuestion: FormGroup;
  options: any = [];

  quiz: QuizEntity = null;
  currentAnswer: AnswerEntity = null;
  currentAnswerIndex = 0;
  //#endregion INTERNAL

  constructor(private _commonService: CommonServices,
    private _uiService: UiServices,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setupComponent();
  }

  //#region DATA
  async setupComponent() {

    if (this.quizId) {
      this.quiz = await this.getQuizData(this.quizId);

      if (!this.quiz) {
        this._uiService.notification('Ocurrio un errro al recuperar los datos', { type: 'error', closeTimer: 3000 });
        return;
      }
      // add blanck spaces in questions
      this.quiz.questions.map((answer: AnswerEntity) => {
        const length = this.quiz.questions.length || 0;
        const newOption = {
          id: length + 1,
          text: '',
          letter: this.getletter(length + 1),
          selected: false
        }
        answer.options.push(newOption);
      });
      // this.quiz.questions.push(this.getNewQuestion());

      this.form = this.fb.group({
        title: [this.quiz.title, Validators.required],
        time: [this.quiz.time, Validators.required],
      });

    } else {
      this.form = this.fb.group({
        title: ['', Validators.required],
        time: [0, Validators.required],
      });

      this.quiz = {
        title: '',
        questions: [this.getNewQuestion()],
        creationDate: new Date().getTime(),
        updatedDate: new Date().getTime(),
        time: 0,
      }
    }

    this.currentAnswerIndex = 0;
    this.setCurrentAnswer();
  }

  setCurrentAnswer() {
    const values = this.quiz.questions[this.currentAnswerIndex];
    const optionArray = [];
    values.options.map(opt => {
      optionArray.push(this.initOption(opt))
    });

    this.formQuestion = this.fb.group({
      question: [values.question, Validators.required],
      answerText: [values.answerText],
      options: this.fb.array(optionArray)
    });
  }

  getOptions(): FormArray {
    return this.formQuestion.get('options') as FormArray;
  }

  get validActions(): boolean {
    const formValid = this.form.valid ?? false;
    const formQuestionValid = this.formQuestion.valid ?? false;
    const question = this.formQuestion.value;
    const questionsValid = question.options.length >= 3;
    const selectedAwnser = question.options.find(opt => opt.selected);

    return formValid && formQuestionValid && selectedAwnser && questionsValid;
  }

  async updateQuiz(cleanUnused = false) {
    const { title, time } = this.form.value;
    this.quiz.title = title;
    this.quiz.time = time;
    this.quiz.creationDate = new Date().getTime();
    this.quiz.updatedDate = new Date().getTime();

    const valuePrev = this.quiz.questions[this.currentAnswerIndex];
    console.log('valuePrev: ', valuePrev);
    const valueNew = this.formQuestion.value;
    console.log('valueNew: ', valueNew);
    this.quiz.questions[this.currentAnswerIndex] = this.formQuestion.value;

    if (cleanUnused) {
      // clean unused data
      this.quiz.questions.map((question: AnswerEntity) => {
        question.options = question.options.filter((opt: OptionEntity) => opt.text != '');
        const correct = question.options.find((opt: OptionEntity) => opt.selected);
        if (correct) {
          question.correctAnswer = correct.id;
        }
      });
      this.quiz.questions = this.quiz.questions.filter((question: AnswerEntity) => question.options.length > 0);
    }

    // save or update data
    if (this.quiz.id) {
      await this._commonService.updateQuiz(this.quiz.id, this.quiz);
    } else {
      this.quiz.id = uuidv4();
      await this._commonService.saveQuiz(this.quiz);
    }
    const data = await this._commonService.searchQuiz(this.quiz.id);
    this.quiz = data;
    console.log('data: ', data);

    if (!data) {
      this._uiService.notification('La informacion no se guardo correctamente');
    }
  }

  async getQuizData(id: string) {
    const data = await this._commonService.searchQuiz(id);
    if (!data) {
      this._uiService.notification('La información no pudo recuperarse correctamente');
      return null;
    }

    return data;
  }
  //#endregion DATA

  //#region EVENTS
  selectAnswerCorrect(option: FormGroup) {
    // reset all items
    this.formQuestion.value.options.map((opt, index) => {
      this.getOptions().controls[index].get('selected').setValue(false);
    });

    // assing correct
    if (option.value.text) {
      option.controls['selected'].setValue(true);
    }
  }

  onOptionChange(event: { control: string, value: any }) {
    const lastIndex = this.formQuestion.value.options.length - 1;
    const lastValue = this.formQuestion.value.options[lastIndex].text;

    if (lastIndex >= 0 && lastValue != '') {
      this.getOptions().push(this.initOption());
    } else if (lastIndex > 0 && lastValue == '') {
      const postlastValue = this.formQuestion.value.options[lastIndex - 1].text;
      if (postlastValue == '') {
        this.getOptions().removeAt(lastIndex);
      }
    }
  }

  gotoDashboard() {
    this._commonService.navigate('dashboard');
  }

  nextQuestion() {
    if (this.currentAnswerIndex >= this.quiz.questions.length - 1) {
      this.quiz.questions[this.currentAnswerIndex] = this.formQuestion.value;
      this.quiz.questions.push(this.getNewQuestion());
    }

    this.updateQuiz();

    this.currentAnswerIndex = this.currentAnswerIndex + 1;
    this.setCurrentAnswer();

    
  }

  prevQuestion() {
    if (this.currentAnswerIndex != 0) {
      this.updateQuiz();

      this.currentAnswerIndex = this.currentAnswerIndex - 1;
      this.setCurrentAnswer();
    }
  }

  finishCreation() {
    this.updateQuiz(true);
    this.gotoDashboard();
  }

  //#endregion EVENTS

  //#region CONVERTERS
  initOption(optionValue?: OptionEntity) {
    let option: OptionEntity = null;
    if (!optionValue) {
      const length = this.formQuestion ? this.formQuestion.value.options.length : 0;
      option = {
        id: length + 1,
        text: '',
        letter: this.getletter(length + 1),
        selected: false
      }
    } else {
      option = {
        id: optionValue.id,
        text: optionValue.text,
        letter: optionValue.letter,
        selected: optionValue.selected
      }
    }
    return this.fb.group(option)
  }

  getletter(index) {
    const ascii = 64; // 65 es el código ASCII de 'A', 90 es el de 'Z'
    const asciiLimit = 90;
    const letter = ascii + index;
    return String.fromCharCode(letter)
  }

  getNewQuestion() {
    const option: OptionEntity = {
      id: 1,
      text: '',
      letter: 'A',
      selected: false
    };

    const question: AnswerEntity = {
      question: '',
      options: [option],
      correctAnswer: 0,
      answerText: ''
    }
    return question;
  }
  //#endregion CONVERTERS

}
