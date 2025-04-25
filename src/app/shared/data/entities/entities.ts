import { AttemptState, GradeState } from "../enumerables/enumerables";

export interface ProfileEntity {
  id?: string;
  userName: string;
  age?: number;
  avatar?: {
    url: string,
    body?: string,
  }
  current: boolean,
}

export interface SettingsEntity {
  id?: string;
  language: string;
  permissions: {
    create: boolean,
    duplicate: boolean,
    edit: boolean,
    delete: boolean,
    ai: boolean,
  }

  availableLanguages: LanguageEntity[];
  premium: boolean,
  colors?: Array<any>;
  theme?: string;
}

export interface LanguageEntity {
  value: string;
  name: string;
}


export interface OptionEntity {
  id: number;
  text: string;
  letter?: string
  selected?: boolean
  correctAnswer?: boolean | null
}

export interface AnswerEntity {
  id?: number;
  question: string;
  options: OptionEntity[];
  correctAnswer?: number
  answerText: string | null;
  selectedAnswer?: number | string;
  isEvaluated?: boolean;
  isCorrect?: boolean;
}

export interface QuizEntity {
  id?: string;
  title: string;
  questions: AnswerEntity[];
  time: number;

  creationDate: number;
  updatedDate: number;

  // varaibles for UI and format
  _showDetails?: boolean;
  _status?: string;
  _current?: boolean;
  _creationDate?: string;
  _updatedDate?: string;
  _attemptsValue?: string;
  _bestTimeValue?: string;
}

export interface AttemptEntity extends QuizEntity {
  attemptId: string;
  state: AttemptState;
  score: number;
  timeEnlapsed?: number;
  grade?: GradeState;
  correctAnswers?: number;
  validTotalAnswers?: number;
}