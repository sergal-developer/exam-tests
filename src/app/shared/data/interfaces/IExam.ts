

export interface IExam {
  id?: string;
  title: string;
  color: string;
  rating?: number;
  score?: number;
  attempts?: number;
  time?: number;
  timeEnlapsed?: number;
  completed?: boolean;
  questionsLenght: number;
  questions: Array<IQuestion>;
  startDate?: number;
  lastUpdate?: number;

  _showDetails?: boolean;
  _status?: string;
  _current?: boolean;
  _date?: string;
  _attemptsValue?: string;
  _bestTimeValue?: string;
}

export interface IQuestion {
  id: number;
  questions: string;
  answer: number | null;
  options: Array<IOption>;
  selectedAnswer?: number | null;
  isEvaluated?: boolean;
  correctAnswer?: number | null;
}

export interface IOption {
  id: number;
  text: string;
  letter?: string
  selected?: boolean
  correctAnswer?: boolean | null
}
