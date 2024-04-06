
export interface IExam {
  id?: string,
  title: string,
  color: string,
  rating?: number,
  score?: number,
  attempts?: number,
  time?: number,
  completed?: boolean,
  questionsLenght: number,
  questions: Array<IQuestion>,
  startDate?: number;
  lastUpdate?: number;

  _showDetails?: boolean;
}

export interface IQuestion {
  id: number,
  questions: string,
  answer: number | null,
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
  correctAnswer?: boolean | null
}
