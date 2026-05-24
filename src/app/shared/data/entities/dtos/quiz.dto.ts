export const quiz_table_script = `CREATE TABLE IF NOT EXISTS [quiz_table] (
  [quizId] INTEGER PRIMARY KEY,
  [uuid] TEXT,
  [title] TEXT,
  [time] INTEGER,
  [creationDate] INTEGER,
  [updatedDate] INTEGER,
  [startDate] INTEGER
);`;

export const answer_table_script = `CREATE TABLE IF NOT EXISTS [answer_table] (
  [answerId] INTEGER PRIMARY KEY,
  [quizId] INTEGER,
  [title] TEXT,
  [updatedDate] INTEGER,
  FOREIGN KEY ([quizId]) REFERENCES [quiz_table] ([quizId]) ON DELETE CASCADE
);`;

export const answer_option_table_script = `CREATE TABLE IF NOT EXISTS [answer_option_table] (
  [optionId] INTEGER PRIMARY KEY AUTOINCREMENT,
  [answerId] INTEGER,
  [content] TEXT,
  [optionIndex] INTEGER,
  [updatedDate] INTEGER,
  [isCorrect] BOOLEAN,
  FOREIGN KEY ([answerId]) REFERENCES [answer_table] ([answerId]) ON DELETE CASCADE
);`;

export const quiz_attempt_table_script = `CREATE TABLE IF NOT EXISTS [quiz_attempt_table] (
  [attemptId] INTEGER PRIMARY KEY,
  [quizId] INTEGER,
  [userId] INTEGER,
  [title] TEXT,
  [startedDate] INTEGER,
  [finishedDate] INTEGER,
  [score] REAL,
  FOREIGN KEY ([quizId]) REFERENCES [quiz_table] ([quizId]) ON DELETE CASCADE
);`;

export const answer_attempt_table_script = `CREATE TABLE IF NOT EXISTS [answer_attempt_table] (
  [answerAttemptId] INTEGER PRIMARY KEY AUTOINCREMENT,
  [attemptId] INTEGER,
  [answerId] INTEGER,
  [selectedOptionId] INTEGER,
  [isCorrect] BOOLEAN,
  FOREIGN KEY ([attemptId]) REFERENCES [quiz_attempt_table] ([attemptId]) ON DELETE CASCADE,
  FOREIGN KEY ([answerId]) REFERENCES [answer_table] ([answerId]),
  FOREIGN KEY ([selectedOptionId]) REFERENCES [answer_option_table] ([optionId])
);`;


export interface IQuizDTO {
  quizId?: number;
  title: string;
  time: number;
  creationDate: number;
  updatedDate: number;
  startDate?: number;

  // Generated
  answers: IAnswerDTO[];
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

export interface IAnswerDTO {
  answerId?: number;
  quizId?: number;
  title: string;
  updatedDate: number;
  
  // Generated
  options: IAnswerOptionDTO[];
  correntOption: number | null;
  answerText: string | null;
  selectedAnswer?: number | string;
  isEvaluated?: boolean;
  isCorrect?: boolean;
}

export interface IAnswerOptionDTO {
  optionId: number;
  answerId: number;
  content: string;
  optionIndex: number;
  updatedDate: number;
  isCorrect?: boolean;
}

export interface IQuizAttemptDTO {
  attemptId: number;
  quizId: number;
  userId: number;
  startedDate: number;
  finishedDate: number;
  score?: number;
  title: string;

  // Generated
  answers: IAttemptAnswerDTO[];
  state: AttemptState;
  timeEnlapsed?: number;
  correctAnswers?: number;
  validTotalAnswers?: number;
  grade?: GradeState;
}

export interface IAttemptAnswerDTO {
  answerAttemptId: number;
  attemptId: number;
  answerId: number;
  selectedOptionId: number;
  isCorrect: boolean;
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
