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
  [creationDate] INTEGER,
  [finishedDate] INTEGER,
  [score] REAL,
  [state] TEXT,
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

//#region INTERFACES
export interface QuizDTO {
  quizId: number;
  uuid?: string; 
  title: string;
  time: number;
  creationDate: number;
  updatedDate: number;
  startDate?: number;

  // GENERATED
  answers?: AnswerDTO[];

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

export interface AnswerDTO {
  answerId?: number;
  quizId?: number;
  title: string;
  updatedDate: number;
  
  // GENERATED
  _options?: AnswerOptionDTO[];
  _currentOption?: number | null;
  _answerText?: string | null;

  _selectedAnswer?: number | string;
  _isEvaluated?: boolean;
  _isCorrect?: boolean;
}

export interface AnswerOptionDTO {
  optionId?: number;
  answerId: number;
  content: string;
  optionIndex: number;
  updatedDate: number;
  isCorrect: boolean;

  // GENERATED
  _selected?: boolean;
}

export interface AttemptDTO {
  attemptId: number;
  quizId: number;
  userId: number;
  title: string;
  creationDate: number;
  updatedDate?: number;
  score: number;
  state: AttemptState;
  

  // GENERATED
  answers?: AttemptAnswerDTO[];
  timeEnlapsed?: number;
  correctAnswers?: number;
  validTotalAnswers?: number;
  grade?: GradeState;

  _creationDate?: string;
  _updatedDate?: string;
}

export interface AttemptAnswerDTO {
  answerAttemptId: number;
  attemptId: number;
  answerId: number;
  selectedOptionId?: number;
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

//#endregion INTERFACES