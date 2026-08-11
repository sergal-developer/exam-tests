
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

export interface AttemptDTO extends QuizDTO {
  attemptId: number;
  quizId: number;
  userId: number;
  score: number;
  state: AttemptState;

  // GENERATED
  answers?: AnswerDTO[];
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


export const quiz_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [quiz_table] (
      [quizId] INTEGER PRIMARY KEY AUTOINCREMENT,
      [uuid] TEXT,
      [title] TEXT,
      [time] INTEGER,
      [creationDate] INTEGER,
      [updatedDate] INTEGER,
      [startDate] INTEGER
    );`
  },

  deleteTable: {
    query:
      `DELETE FROM quiz_table;`
  },

  select: {
    query:
      `SELECT * FROM quiz_table;`
  },

  selectById: {
    query:
      `SELECT * FROM quiz_table WHERE quizId = ?;`
  },

  selectWithRelations: {
    query:
      `SELECT 
            q.quizId,
            q.uuid,
            q.title,
            q.time,
            q.creationDate,
            q.updatedDate,
            q.startDate,
            (
                SELECT json_group_array(
                    json_object(
                        'answerId', a.answerId,
                        'quizId', a.quizId,
                        'title', a.title,
                        'updatedDate', a.updatedDate,
                        '_options', (
                            SELECT json_group_array(
                                json_object(
                                    'optionId', o.optionId,
                                    'answerId', o.answerId,
                                    'content', o.content,
                                    'optionIndex', o.optionIndex,
                                    'updatedDate', o.updatedDate,
                                    'isCorrect', o.isCorrect
                                )
                            )
                            FROM answer_option_table o
                            WHERE o.answerId = a.answerId
                        )
                    )
                )
                FROM answer_table a
                WHERE a.quizId = q.quizId
            ) as answers
        FROM quiz_table q
        WHERE q.quizId = ?;`
  },

  post: {
    query:
      `INSERT INTO quiz_table (uuid, title, time, creationDate, updatedDate, startDate) 
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *;`
  },

  put: {
    query:
      `INSERT INTO quiz_table (quizId, uuid, title, time, creationDate, updatedDate, startDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(quizId) DO UPDATE SET 
            uuid = excluded.uuid,
            title = excluded.title, 
            time = excluded.time, 
            creationDate = excluded.creationDate, 
            updatedDate = excluded.updatedDate, 
            startDate = excluded.startDate
        RETURNING *;`
  },
  deleteById: {
    query:
      `DELETE FROM quiz_table WHERE quizId = ?`

  }
}

export const answer_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [answer_table] (
      [answerId] INTEGER PRIMARY KEY AUTOINCREMENT,
      [quizId] INTEGER,
      [title] TEXT,
      [updatedDate] INTEGER,
      FOREIGN KEY ([quizId]) REFERENCES [quiz_table] ([quizId]) ON DELETE CASCADE
    );`
  },
  deleteTable: {
    query:
      `DELETE FROM user_table;`
  },

  select: {
    query:
      `SELECT * FROM answer_table;`
  },

  selectById: {
    query:
      `SELECT * FROM answer_table WHERE quizId = ?;`
  },

  post: {
    query:
      `INSERT INTO answer_table (quizId, title, updatedDate) 
        VALUES (?, ?, ?)
        RETURNING *;`
  },

  put: {
    query:
      `INSERT INTO answer_table (answerId, quizId, title, updatedDate) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(answerId) DO UPDATE SET 
            quizId = excluded.quizId, 
            title = excluded.title, 
            updatedDate = excluded.updatedDate
        RETURNING *;`
  },

  deleteById: {
    query:
      `DELETE FROM answer_table WHERE answerId = ?;`

  }
}

export const answer_option_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [answer_option_table] (
      [optionId] INTEGER PRIMARY KEY AUTOINCREMENT,
      [answerId] INTEGER,
      [content] TEXT,
      [optionIndex] INTEGER,
      [updatedDate] INTEGER,
      [isCorrect] BOOLEAN,
      FOREIGN KEY ([answerId]) REFERENCES [answer_table] ([answerId]) ON DELETE CASCADE
    );`
  },
  deleteTable: {
    query:
      `DELETE FROM user_table;`
  },

  selectByAnswer: {
    query:
      `SELECT * FROM answer_option_table WHERE answerId = ? ORDER BY optionIndex ASC;`
  },

  post: {
    query:
      `INSERT INTO answer_option_table (answerId, content, optionIndex, updatedDate, isCorrect) 
        VALUES (?, ?, ?, ?, ?)
        RETURNING *;`
  },

  put: {
    query:
      `INSERT INTO answer_option_table (optionId, answerId, content, optionIndex, updatedDate, isCorrect) 
        VALUES (?, ?, ?, ?, ?, ?) 
        ON CONFLICT(optionId) DO UPDATE SET 
            answerId = excluded.answerId, 
            content = excluded.content, 
            optionIndex = excluded.optionIndex, 
            updatedDate = excluded.updatedDate, 
            isCorrect = excluded.isCorrect
        RETURNING *;`
  },

  deleteById: {
    query:
      `DELETE FROM answer_option_table WHERE optionId = ?;`
  }
}

export const quiz_attempt_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [quiz_attempt_table] (
      [attemptId] INTEGER PRIMARY KEY,
      [quizId] INTEGER,
      [userId] INTEGER,
      [title] TEXT,
      [creationDate] INTEGER,
      [updatedDate] INTEGER,
      [score] REAL,
      [state] TEXT,
      FOREIGN KEY ([quizId]) REFERENCES [quiz_table] ([quizId]) ON DELETE CASCADE
    );`
  },

  deleteTable: {
    query:
      `DELETE FROM user_table;`
  },

  selectByUser: {
    query:
      `SELECT * FROM quiz_attempt_table WHERE userId = ?;`
  },

  selectById: {
    query:
      `SELECT * FROM quiz_attempt_table WHERE attemptId = ?;`
  },

  selectWithRelationsById: {
    query:
      `SELECT
            q.attemptId,
            q.quizId,
            q.userId,
            q.title,
            q.creationDate,
            q.updatedDate,
            q.score,
            q.state,
            (
                SELECT json_group_array(
                    json_object(
                        'answerAttemptId', a.answerAttemptId,
                        'attemptId', a.attemptId,
                        'answerId', a.answerId,
                        'selectedOptionId', a.selectedOptionId,
                        'isCorrect', a.isCorrect
                    )
                )
                FROM answer_attempt_table a
                WHERE a.attemptId = q.attemptId
            ) as answers
        FROM quiz_attempt_table q
        WHERE q.attemptId = ?;`
  },

  post: {
    query:
      `INSERT INTO quiz_attempt_table (quizId, userId, title, creationDate, updatedDate, score, state) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING *;`
  },

  put: {
    query:
      `INSERT INTO quiz_attempt_table (attemptId, quizId, userId, title, creationDate, updatedDate, score, state) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(attemptId) DO UPDATE SET 
            quizId = excluded.quizId, 
            userId = excluded.userId,
            title = excluded.title,
            creationDate = excluded.creationDate, 
            updatedDate = excluded.updatedDate, 
            score = excluded.score,
            state = excluded.state
        RETURNING *;`
  },

  deleteById: {
    query:
      `DELETE FROM quiz_attempt_table WHERE attemptId = ?;`
  }
}

export const answer_attempt_querys = {
  createTable: {
    query:
      `CREATE TABLE IF NOT EXISTS [answer_attempt_table] (
      [answerAttemptId] INTEGER PRIMARY KEY AUTOINCREMENT,
      [attemptId] INTEGER,
      [answerId] INTEGER,
      [selectedOptionId] INTEGER,
      [isCorrect] BOOLEAN,
      FOREIGN KEY ([attemptId]) REFERENCES [quiz_attempt_table] ([attemptId]) ON DELETE CASCADE,
      FOREIGN KEY ([answerId]) REFERENCES [answer_table] ([answerId]),
      FOREIGN KEY ([selectedOptionId]) REFERENCES [answer_option_table] ([optionId])
    );`
  },

  deleteTable: {
    query:
      `DELETE FROM user_table;`
  },

  selectByAttemptId: {
    query:
      `SELECT * FROM answer_attempt_table WHERE attemptId = ?;`
  },

  selectById: {
    query:
      `SELECT * FROM user_table WHERE value = ?;`
  },

  post: {
    query:
      `INSERT INTO answer_attempt_table (attemptId, answerId, selectedOptionId, isCorrect) 
        VALUES (?, ?, ?, ?)
        RETURNING *;`
  },

  put: {
    query:
      `INSERT INTO answer_attempt_table (answerAttemptId, attemptId, answerId, selectedOptionId, isCorrect) 
        VALUES (?, ?, ?, ?, ?) 
        ON CONFLICT(answerAttemptId) DO UPDATE SET 
            attemptId = excluded.attemptId, 
            answerId = excluded.answerId, 
            selectedOptionId = excluded.selectedOptionId, 
            isCorrect = excluded.isCorrect
        RETURNING *;`
  },

  deleteById: {
    query:
      `DELETE FROM answer_attempt_table WHERE answerAttemptId = ?;`
  }
}

