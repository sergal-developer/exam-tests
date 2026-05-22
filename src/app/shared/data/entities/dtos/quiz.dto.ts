import { Column, generateTableFromClass } from "src/app/shared/services/database/sqlite.orm";

export class QuizDTO {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ notNull: true })
    title!: string;

    @Column({ notNull: true })
    time!: number;

    @Column()
    creationDate!: number;

    @Column()
    updatedDate!: number;

    @Column()
    startDate!: number;
    
    @Column()
    questions!: string;
}

export class AttemptDTO {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ notNull: true })
    title!: string;

    @Column({ notNull: true })
    time!: number;

    @Column()
    creationDate!: number;

    @Column()
    updatedDate!: number;

    @Column()
    startDate!: number;
    
    @Column()
    questions!: string;

    @Column()
    state!: string;

    @Column()
    score!: number;

    @Column()
    grade!: string;

    @Column()
    correctAnswers!: number;
}

export class AnswerDTO {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ notNull: true })
  question!: string;

  // @Column({ notNull: true })
  // options!: OptionEntity[];

  @Column({ notNull: true })
  correctAnswer!: number;

  @Column()
  answerText!: string;

  @Column()
  selectedAnswer!: string;

  @Column()
  isEvaluated!: boolean;

  @Column()
  isCorrect!: boolean;
}

export class OptionDTO {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ notNull: true })
  text!: string;

  @Column()
  letter!: string;

  @Column()
  selected!: boolean;

  @Column({ notNull: true })
  correctAnswer!: boolean;
}

export const QuizDTOScript = generateTableFromClass(QuizDTO, 'quiz_table');

export const AttemptDTOScript = generateTableFromClass(AttemptDTO, 'attempts_table');

export const AnswerDTOScript = generateTableFromClass(AnswerDTO, 'answers_table');

export const OptionDTOScript = generateTableFromClass(OptionDTO, 'options_table');


export interface IQuizDTO {
  id?: string;
  title: string;
  questions: IAnswerDTO[];
  time: number;

  creationDate: number;
  updatedDate: number;
  startDate?: number;

  // varaibles for UI and format
  _showDetails?: boolean;
  _status?: string;
  _current?: boolean;
  _creationDate?: string;
  _updatedDate?: string;
  _startDate?: string;
  _attemptsValue?: string;
  _bestTimeValue?: string;
}

export interface IAttemptDTO extends IQuizDTO {
  attemptId: string;
  state: AttemptState;
  score: number;

  _score?: string;
  timeEnlapsed?: number;
  grade?: GradeState;
  correctAnswers?: number;
  validTotalAnswers?: number;
}

export interface IAnswerDTO {
  id?: number;
  question: string;
  options: IOptionDTO[];
  correctAnswer?: number
  answerText: string | null;
  selectedAnswer?: number | string;
  isEvaluated?: boolean;
  isCorrect?: boolean;
}

export interface IOptionDTO {
  id: number;
  text: string;
  letter?: string
  selected?: boolean
  correctAnswer?: boolean
}

export enum AttemptState {
    new = 'new',
    progress = 'progress',
    completed = 'completed'
}

export enum GradeState {
    passed = 'passed',
    failed = 'failed',
    barely_passed = 'barely_passed',
}
