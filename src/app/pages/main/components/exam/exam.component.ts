import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { EVENTS, ScreenEnum } from 'src/app/shared/data/enumerables/enumerables';
import { EventBusService } from 'src/app/shared/data/utils/event.services';
// import { EventBusService } from 'src/app/shared/data/utils/event.services';

@Component({
  selector: 'exam',
  templateUrl: './exam.html',
  styleUrls: ['./exam.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExamComponent implements OnInit {
  @Input() data: any;
  
  constructor(private eventService: EventBusService) { }

  exam: IExam = {
    title: 'Exam-test',
    color: 'cyan',
    questionsLenght: 0,
    rating: 0,
    attempts: 0,
    completed: false,
    time: 20,
    questions: [
      {
        "id": 0,
        "questions": "¿Cuál es el propósito de tomar los signos vitales de un paciente?",
        "answer": 2,
        "options": [
          { "id": 1, "text": "Medir la temperatura corporal." },
          { "id": 2, "text": "Evaluar la función fisiológica del paciente." },
          { "id": 3, "text": "Calcular la presión arterial." },
          { "id": 4, "text": "Determinar el nivel de glucosa en sangre." },
          { "id": 5, "text": "Observar el estado emocional del paciente." },
          { "id": 6, "text": "Registrar la cantidad de líquidos ingeridos." }
        ]
      },
      {
        "id": 1,
        "questions": "¿Qué es la terapia intravenosa y cómo se administra?",
        "answer": 3,
        "options": [
          { "id": 1, "text": "Es una forma de administrar medicamentos a través de la piel." },
          { "id": 2, "text": "Es una técnica para medir la presión arterial." },
          { "id": 3, "text": "Es la introducción de líquidos o medicamentos en la vena." },
          { "id": 4, "text": "Es un método para controlar el nivel de glucosa en sangre." },
          { "id": 5, "text": "Es una técnica para medir la saturación de oxígeno en la sangre." },
          { "id": 6, "text": "Es una forma de administrar líquidos por vía oral." }
        ]
      },
      // {
      //   "id": 2,
      //   "questions": "¿Cuál es la diferencia entre una escala de dolor numérica y una escala visual analógica?",
      //   "answer": 1,
      //   "options": [
      //     { "id": 1, "text": "La escala numérica utiliza números para medir el dolor, mientras que la visual analógica utiliza una línea." },
      //     { "id": 2, "text": "La escala numérica utiliza imágenes para representar el dolor, mientras que la visual analógica utiliza palabras." },
      //     { "id": 3, "text": "La escala numérica solo se aplica a pacientes pediátricos, mientras que la visual analógica se aplica a adultos." },
      //     { "id": 4, "text": "La escala numérica solo se aplica a pacientes adultos, mientras que la visual analógica se aplica a pacientes pediátricos." },
      //     { "id": 5, "text": "La escala numérica se utiliza para medir la presión arterial, mientras que la visual analógica se utiliza para medir la temperatura corporal." },
      //     { "id": 6, "text": "La escala numérica se utiliza para medir la saturación de oxígeno en la sangre, mientras que la visual analógica se utiliza para medir la frecuencia cardíaca." }
      //   ]
      // },
      // {
      //   "id": 3,
      //   "questions": "¿Qué es un catéter urinario y cuál es su propósito en el cuidado del paciente?",
      //   "answer": 4,
      //   "options": [
      //     { "id": 1, "text": "Es un dispositivo para medir la presión arterial." },
      //     { "id": 2, "text": "Es un dispositivo para administrar líquidos intravenosos." },
      //     { "id": 3, "text": "Es un dispositivo para medir la temperatura corporal." },
      //     { "id": 4, "text": "Es un tubo delgado que se inserta en la vejiga para drenar la orina." },
      //     { "id": 5, "text": "Es un instrumento para medir la glucosa en sangre." },
      //     { "id": 6, "text": "Es un dispositivo para medir la saturación de oxígeno en la sangre." }
      //   ]
      // },
      // {
      //   "id": 4,
      //   "questions": "¿Qué es la prevención de infecciones nosocomiales y cuáles son algunas medidas para prevenirlas?",
      //   "answer": 1,
      //   "options": [
      //     { "id": 1, "text": "Son infecciones adquiridas en el entorno hospitalario y medidas para prevenirlas incluyen la higiene de manos y la limpieza adecuada." },
      //     { "id": 2, "text": "Son infecciones adquiridas en el hogar y medidas para prevenirlas incluyen el uso de mascarillas y guantes." },
      //     { "id": 3, "text": "Son infecciones causadas por virus y medidas para prevenirlas incluyen el distanciamiento social y el lavado frecuente de manos." },
      //     { "id": 4, "text": "Son infecciones transmitidas por insectos y medidas para prevenirlas incluyen el uso de repelentes." },
      //     { "id": 5, "text": "Son infecciones causadas por bacterias y medidas para prevenirlas incluyen el uso de cremas antibióticas." },
      //     { "id": 6, "text": "Son infecciones causadas por hongos y medidas para prevenirlas incluyen el uso de antifúngicos." }
      //   ]
      // },
      // {
      //   "id": 5,
      //   "questions": "¿Qué es la higiene de manos y por qué es importante en la enfermería?",
      //   "answer": 1,
      //   "options": [
      //     { "id": 1, "text": "Es el proceso de lavado y desinfección de las manos para prevenir la transmisión de enfermedades." },
      //     { "id": 2, "text": "Es el proceso de limpieza de la boca para mantener una buena salud oral." },
      //     { "id": 3, "text": "Es el proceso de limpieza de la piel para prevenir la sequedad." },
      //     { "id": 4, "text": "Es el proceso de limpieza de las uñas para prevenir las infecciones." },
      //     { "id": 5, "text": "Es el proceso de limpieza de los oídos para prevenir la acumulación de cerumen." },
      //     { "id": 6, "text": "Es el proceso de limpieza de los ojos para prevenir las infecciones." }
      //   ]
      // },
      // {
      //   "id": 6,
      //   "questions": "¿Qué es la presión arterial y cómo se mide?",
      //   "answer": 2,
      //   "options": [
      //     { "id": 1, "text": "Es la cantidad de sangre que bombea el corazón por minuto." },
      //     { "id": 2, "text": "Es la fuerza que ejerce la sangre contra las paredes de las arterias." },
      //     { "id": 3, "text": "Es la cantidad de oxígeno en la sangre." },
      //     { "id": 4, "text": "Es la velocidad a la que late el corazón." },
      //     { "id": 5, "text": "Se mide utilizando un estetoscopio y un esfigmomanómetro." },
      //     { "id": 6, "text": "Se mide contando el número de latidos del corazón por minuto." }
      //   ]
      // },
      // {
      //   "id": 7,
      //   "questions": "¿Qué medidas tomarías para prevenir úlceras por presión en un paciente inmovilizado?",
      //   "answer": 4,
      //   "options": [
      //     { "id": 1, "text": "Cambiar la posición del paciente cada 2 horas." },
      //     { "id": 2, "text": "Aplicar crema hidratante en las áreas de presión." },
      //     { "id": 3, "text": "Utilizar almohadas para aliviar la presión en las áreas vulnerables." },
      //     { "id": 4, "text": "Mantener la piel limpia y seca." },
      //     { "id": 5, "text": "Masajear las áreas de presión para mejorar la circulación sanguínea." },
      //     { "id": 6, "text": "Utilizar dispositivos de alivio de presión como colchones de aire." }
      //   ]
      // },
      // {
      //   "id": 8,
      //   "questions": "¿Qué es la dieta adecuada para un paciente diabético?",
      //   "answer": 3,
      //   "options": [
      //     { "id": 1, "text": "Alta en grasas y baja en carbohidratos." },
      //     { "id": 2, "text": "Alta en carbohidratos y baja en proteínas." },
      //     { "id": 3, "text": "Equilibrada en carbohidratos, proteínas y grasas." },
      //     { "id": 4, "text": "Baja en carbohidratos y alta en proteínas." },
      //     { "id": 5, "text": "Alta en fibra y baja en grasas." },
      //     { "id": 6, "text": "Alta en proteínas y baja en grasas." }
      //   ]
      // },
      // {
      //   "id": 9,
      //   "questions": "¿Qué es la valoración de enfermería y por qué es importante?",
      //   "answer": 1,
      //   "options": [
      //     { "id": 1, "text": "Es la evaluación completa del estado de salud del paciente y es importante para planificar y proporcionar cuidados individualizados." },
      //     { "id": 2, "text": "Es la administración de medicamentos según las necesidades del paciente." },
      //     { "id": 3, "text": "Es la técnica para medir la presión arterial y la temperatura corporal." },
      //     { "id": 4, "text": "Es la gestión de los recursos materiales en una unidad de enfermería." },
      //     { "id": 5, "text": "Es la intervención directa en la realización de procedimientos médicos." },
      //     { "id": 6, "text": "Es la coordinación de los cuidados entre el equipo multidisciplinario." }
      //   ]
      // }
    ]
  };

  timer = 30;
  timeEnlapsed = 0;
  timerFormated = '';
  interval: any;
  questions: Array<IQuestion> = [];

  completeQuestionarie = false;

  currentQuestionIndex = -1;
  currentQuestion: any = null;
  waitingTimeToNext = 500;
 
  score: any = null;
  scoreResume = {
    correct: 0,
    total: 0,
    score: 0
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.score = null;
    this.scoreResume = {
      correct: 0,
      total: 0,
      score: 0
    }
    this.currentQuestion = null;

    this.loadExam();
  }

  loadExam() {
    this.exam.questions.map((question: IQuestion) => {
      question.selectedAnswer = null;
      question.isEvaluated = false;
      question.options.map(op => {
        op.selected = false;
      });

      this.questions.push(question);
    });
    this.exam.questionsLenght = this.exam.questions.length;

    this.currentQuestionIndex = 0;
    console.log('this.currentQuestionIndex: ', this.currentQuestionIndex);
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    console.log('this.currentQuestion: ', this.currentQuestion);

    this.startTimers();
    this.updateHeaders();
    
      // This section is only test for score
    // setTimeout(() => {
    //   this.currentQuestionIndex = this.exam.questions.length;
    //   this.currentQuestion = null
      
    //   this.completeQuiz();
    // }, 2000);
  }

  updateHeaders() {
    this.data.title = this.exam.title;
    this.data.questions = this.exam.questionsLenght;
    this.data.color = this.exam.color;
    this.data.current = this.currentQuestionIndex + 1;
    this.data.progress = `${ (100 / this.exam.questionsLenght) * this.data.current }%`;
    this.data.completed =  this.exam.completed;
  
    this.eventService.emit({ name: EVENTS.CONFIG, component: 'subheader', value: this.data });
  }

  startTimers() {
    const minutes = 1000 * 60 * this.timer;

    this.timeEnlapsed = 0;
    this.interval = setInterval(() => {
      if (this.timeEnlapsed >= minutes) {
        this.timerFormated = 'Finished.'
        clearInterval(this.interval);
        this.interval = null;
        return;
      }

      this.timeEnlapsed = this.timeEnlapsed + 1000;

      const miliseconds = minutes - this.timeEnlapsed;

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
    this.exam.completed = true;
    this.exam.attempts = this.exam.attempts ? this.exam.attempts + 1 : 1;
    
    clearInterval(this.interval);
    this.interval = null;


    this.getScoreExam();
    this.updateHeaders();
  }

  getScoreExam() {
    const correct = []
    const total = this.exam.questions.length;
    this.exam.questions.map((q: IQuestion) => {
      q.correctAnswer = q.selectedAnswer === q.answer;
      if(q.correctAnswer) {
        correct.push(q);
      }
    });

    const score =  correct.length / total;
    this.score = score * 100;
    this.scoreResume = {
      correct: correct.length,
      total: this.questions.length,
      score: this.score
    }
    return this.score;
  }

  repeatExam() {
    this.exam.completed = false;
    this.questions = [];
    this.completeQuestionarie = false;
    this.init();
  }

  closeExam() {
    this.eventService.emit({ name: EVENTS.CONFIG, component: 'reset', value: ScreenEnum.dashboard });
  }
}

export interface IExam {
  title: string,
  color: string,
  rating?: number,
  score?: number,
  attempts?: number,
  time?: number,
  completed?: boolean,
  questionsLenght: number,
  questions: Array<IQuestion>
}

export interface IQuestion {
  id: number,
  questions: string,
  answer: number,
  options: Array<IOption>,
  selectedAnswer?: number | null,
  isEvaluated?: boolean,
  correctAnswer?: any
}

export interface IOption {
  id: number,
  text: string,
  letter?: string
  selected?: boolean
  correctAnswer?: boolean
}
