
//#region INTERFACES
export interface QuizDTO {
  quizId: number;
  uuid?: string;
  title: string;
  time: number;
  creationDate?: number;
  updatedDate?: number;
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
  // quizId: number; the filed exist in QuizDTO
  userId: number;
  title: string;
  updatedDate: number;
  startDate?: number;
  score: number;
  state: AttemptState;
  time: number;
  answersLinked: string;

  // GENERATED
  answers?: AttemptAnswerDTO[];
  timeEnlapsed?: number;
  correctAnswers?: number;
  validTotalAnswers?: number;
  grade?: GradeState;
  _updatedDate?: string;
  _startDate?: string;
}

export interface AttemptAnswerDTO extends AnswerDTO {
  answerAttemptId?: number;
  attemptId: number;
  //answerId: number; this field exist in AnswerDTO
  selectedOptionId?: number;
  isCorrect: boolean;
  optionsLinked: string;
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


export const quiz_table_querys = {

  createTable: {
    query: `
      CREATE TABLE IF NOT EXISTS [quiz_table] (
        [quizId] INTEGER PRIMARY KEY AUTOINCREMENT,
        [uuid] TEXT,
        [title] TEXT,
        [time] INTEGER,
        [creationDate] INTEGER,
        [updatedDate] INTEGER,
        [startDate] INTEGER
      );
    `
  },

  deleteTable: {
    query: `
      DROP TABLE IF EXISTS [quiz_table];
    `
  },

  selectAll: {
    query: `
      SELECT *
      FROM [quiz_table];
    `
  },

  selectById: {
    query: `
      SELECT *
      FROM [quiz_table]
      WHERE [quizId] = ?;
    `
  },

  selectByIdWithRelations: {
    query: `
      SELECT
        q.[quizId],
        q.[uuid],
        q.[title],
        q.[time],
        q.[creationDate],
        q.[updatedDate],
        q.[startDate],

        COALESCE(
          (
            SELECT json_group_array(
              json_object(
                'answerId', a.[answerId],
                'quizId', a.[quizId],
                'title', a.[title],
                'updatedDate', a.[updatedDate],

                'options',
                COALESCE(
                  (
                    SELECT json_group_array(
                      json_object(
                        'optionId', ao.[optionId],
                        'answerId', ao.[answerId],
                        'content', ao.[content],
                        'optionIndex', ao.[optionIndex],
                        'updatedDate', ao.[updatedDate],
                        'isCorrect', ao.[isCorrect]
                      )
                    )
                    FROM [answer_option_table] ao
                    WHERE ao.[answerId] = a.[answerId]
                  ),
                  json('[]')
                )
              )
            )
            FROM [answer_table] a
            WHERE a.[quizId] = q.[quizId]
          ),
          json('[]')
        ) AS [answers]

      FROM [quiz_table] q

      WHERE q.[quizId] = ?;
    `
  },

  filterBy: {
    query: `
      SELECT *
      FROM [quiz_table]
      WHERE [title] LIKE '%' || :title || '%';
    `
  },

  post: {
    query: `
      INSERT INTO [quiz_table] (
        [uuid],
        [title],
        [time],
        [creationDate],
        [updatedDate],
        [startDate]
      )
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *;
    `
  },

  put: {
    query: `
      INSERT INTO [quiz_table] (
        [quizId],
        [uuid],
        [title],
        [time],
        [creationDate],
        [updatedDate],
        [startDate]
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(quizId) DO UPDATE SET 
            uuid = excluded.uuid,
            title = excluded.title, 
            time = excluded.time, 
            creationDate = excluded.creationDate, 
            updatedDate = excluded.updatedDate, 
            startDate = excluded.startDate
      RETURNING *;
    `
  },

  deleteById: {
    query: `
      DELETE FROM [quiz_table]
      WHERE [quizId] = :quizId;
    `
  },
};

export const answer_table_querys = {

  createTable: {
    query: `
      CREATE TABLE IF NOT EXISTS [answer_table] (
        [answerId] INTEGER PRIMARY KEY AUTOINCREMENT,
        [quizId] INTEGER,
        [title] TEXT,
        [updatedDate] INTEGER,
        FOREIGN KEY ([quizId])
          REFERENCES [quiz_table] ([quizId])
          ON DELETE CASCADE
      );
    `
  },

  deleteTable: {
    query: `
      DROP TABLE IF EXISTS [answer_table];
    `
  },

  selectAll: {
    query: `
      SELECT *
      FROM [answer_table];
    `
  },

  selectById: {
    query: `
      SELECT *
      FROM [answer_table]
      WHERE [answerId] = :answerId;
    `
  },

  filterBy: {
    query: `
      SELECT *
      FROM [answer_table]
      WHERE [quizId] = :quizId;
    `
  },

  post: {
    query: `
      INSERT INTO [answer_table] (
        [quizId],
        [title],
        [updatedDate]
      )
      VALUES (?, ?, ?)
      RETURNING *;
    `
  },

  put: {
    query: `
      INSERT INTO [answer_table] (
        [answerId],
        [quizId],
        [title],
        [updatedDate]
      ) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(answerId) DO UPDATE SET 
      SET
        [quizId] = excluded.quizId,
        [title] = excluded.title,
        [updatedDate] = excluded.updatedDate
      RETURNING *;
    `
  },

  deleteById: {
    query: `
      DELETE FROM [answer_table]
      WHERE [answerId] = ?;
    `
  }

};

export const answer_option_table_querys = {

  createTable: {
    query: `
      CREATE TABLE IF NOT EXISTS [answer_option_table] (
        [optionId] INTEGER PRIMARY KEY AUTOINCREMENT,
        [answerId] INTEGER,
        [content] TEXT,
        [optionIndex] INTEGER,
        [updatedDate] INTEGER,
        [isCorrect] BOOLEAN,
        FOREIGN KEY ([answerId])
          REFERENCES [answer_table] ([answerId])
          ON DELETE CASCADE
      );
    `
  },

  deleteTable: {
    query: `
      DROP TABLE IF EXISTS [answer_option_table];
    `
  },

  selectAll: {
    query: `
      SELECT *
      FROM [answer_option_table];
    `
  },

  selectById: {
    query: `
      SELECT *
      FROM [answer_option_table]
      WHERE [optionId] = ?;
    `
  },

  selectByAnswerId: {
    query: `
      SELECT *
      FROM [answer_option_table]
      WHERE [answerId] = ?
      ORDER BY optionIndex ASC;
    `
  },

  filterBy: {
    query: `
      SELECT *
      FROM [answer_option_table]
      WHERE [answerId] = :answerId;
    `
  },

  post: {
    query: `
      INSERT INTO [answer_option_table] (
        [answerId],
        [content],
        [optionIndex],
        [updatedDate],
        [isCorrect]
      )
      VALUES ( ?, ?, ?, ?, ?)
      RETURNING *;
    `
  },

  put: {
    query: `
      INSERT INTO [answer_option_table] (
          [optionId],
          [answerId],
          [content],
          [optionIndex],
          [updatedDate],
          [isCorrect]
      )
      VALUES ( ?, ?, ?, ?, ?, ?)
      ON CONFLICT(optionId) DO UPDATE SET 
          answerId = excluded.answerId, 
          content = excluded.content, 
          optionIndex = excluded.optionIndex, 
          updatedDate = excluded.updatedDate, 
          isCorrect = excluded.isCorrect
      RETURNING *;
    `
  },

  deleteById: {
    query: `
      DELETE FROM [answer_option_table]
      WHERE [optionId] = :optionId;
    `
  }

};

export const quiz_attempt_table_querys = {

  createTable: {
    query: `
      CREATE TABLE IF NOT EXISTS [quiz_attempt_table] (
        [attemptId] INTEGER PRIMARY KEY AUTOINCREMENT,
        [quizId] INTEGER,
        [userId] INTEGER,
        [title] TEXT,
        [updatedDate] INTEGER,
        [startDate] INTEGER,
        [score] REAL,
        [state] TEXT,
        [time] INTEGER,
        [answersLinked] TEXT,
        FOREIGN KEY ([quizId])
          REFERENCES [quiz_table] ([quizId])
          ON DELETE CASCADE
      );
    `
  },

  deleteTable: {
    query: `
      DROP TABLE IF EXISTS [quiz_attempt_table];
    `
  },

  selectAll: {
    query: `
      SELECT *
      FROM [quiz_attempt_table];
    `
  },

  selectById: {
    query: `
      SELECT *
      FROM [quiz_attempt_table]
      WHERE [attemptId] = ?;
    `
  },

  selectByQuizId: {
    query: `
      SELECT *
      FROM [quiz_attempt_table]
      WHERE [quizId] = ?;
    `
  },

  selectByUserId: {
    query: `
      SELECT *
      FROM [quiz_attempt_table]
      WHERE [userId] = ?;
    `
  },

  filterBy: {
    query: `
      SELECT *
      FROM [quiz_attempt_table]
      WHERE [quizId] = :quizId;
    `
  },

  selectByIdWithRelations: {
    query: `
      SELECT
        qa.[attemptId],
        qa.[quizId],
        qa.[userId],
        qa.[title],
        qa.[updatedDate],
        qa.[startDate],
        qa.[score],
        qa.[state],
        qa.[time],
        qa.[answersLinked],

        COALESCE(
          (
            SELECT json_group_array(
              json_object(
                'answerAttemptId', aa.[answerAttemptId],
                'attemptId', aa.[attemptId],
                'answerId', aa.[answerId],
                'selectedOptionId', aa.[selectedOptionId],
                'isCorrect', aa.[isCorrect],
                'optionsLinked', aa.[optionsLinked],

                'answer',
                CASE
                  WHEN a.[answerId] IS NOT NULL THEN
                    json_object(
                      'answerId', a.[answerId],
                      'quizId', a.[quizId],
                      'title', a.[title],
                      'updatedDate', a.[updatedDate]
                    )
                  ELSE NULL
                END,

                'selectedOption',
                CASE
                  WHEN ao.[optionId] IS NOT NULL THEN
                    json_object(
                      'optionId', ao.[optionId],
                      'answerId', ao.[answerId],
                      'content', ao.[content],
                      'optionIndex', ao.[optionIndex],
                      'updatedDate', ao.[updatedDate],
                      'isCorrect', ao.[isCorrect]
                    )
                  ELSE NULL
                END
              )
            )
            FROM [answer_attempt_table] aa

            LEFT JOIN [answer_table] a
              ON a.[answerId] = aa.[answerId]

            LEFT JOIN [answer_option_table] ao
              ON ao.[optionId] = aa.[selectedOptionId]

            WHERE aa.[attemptId] = qa.[attemptId]
          ),
          json('[]')
        ) AS [answerAttempts]

      FROM [quiz_attempt_table] qa

      WHERE qa.[attemptId] = ?;
    `
  },

  post: {
    query: `
      INSERT INTO [quiz_attempt_table] (
        [quizId],
        [userId],
        [title],
        [updatedDate],
        [startDate],
        [score],
        [state],
        [time],
        [answersLinked]
      )
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )
      RETURNING *;
    `
  },

  put: {
    query: `
      INSERT INTO [quiz_attempt_table] (
          [attemptId],
          [quizId],
          [userId],
          [title],
          [updatedDate],
          [startDate],
          [score],
          [state],
          [time],
          [answersLinked]
      )
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
      ON CONFLICT(attemptId) DO UPDATE SET 
            [quizId] = excluded.[quizId], 
            [userId] = excluded.[userId],
            [title] = excluded.[title],
            [updatedDate] = excluded.[updatedDate], 
            [startDate] = excluded.[startDate], 
            [score] = excluded.[score],
            [state] = excluded.[state],
            [time] = excluded.[time],
            [answersLinked] = excluded.[answersLinked]
      RETURNING *;
    `
  },

  deleteById: {
    query: `
      DELETE FROM [quiz_attempt_table]
      WHERE [attemptId] = :attemptId;
    `
  },
};

export const answer_attempt_table_querys = {

  createTable: {
    query: `
      CREATE TABLE IF NOT EXISTS [answer_attempt_table] (
        [answerAttemptId] INTEGER PRIMARY KEY AUTOINCREMENT,
        [attemptId] INTEGER,
        [answerId] INTEGER,
        [selectedOptionId] INTEGER,
        [isCorrect] BOOLEAN,
        [optionsLinked] TEXT,

        FOREIGN KEY ([attemptId])
          REFERENCES [quiz_attempt_table] ([attemptId])
          ON DELETE CASCADE,

        FOREIGN KEY ([answerId])
          REFERENCES [answer_table] ([answerId]),

        FOREIGN KEY ([selectedOptionId])
          REFERENCES [answer_option_table] ([optionId])
      );
    `
  },

  deleteTable: {
    query: `
      DROP TABLE IF EXISTS [answer_attempt_table];
    `
  },

  selectAll: {
    query: `
      SELECT *
      FROM [answer_attempt_table];
    `
  },

  selectById: {
    query: `
      SELECT *
      FROM [answer_attempt_table]
      WHERE [answerAttemptId] = ?;
    `
  },

  selectByAttemptId: {
    query: `
      SELECT *
      FROM [answer_attempt_table]
      WHERE [attemptId] = ?;
    `
  },

  filterBy: {
    query: `
      SELECT *
      FROM [answer_attempt_table]
      WHERE [attemptId] = ?;
    `
  },

  post: {
    query: `
      INSERT INTO [answer_attempt_table] (
        [attemptId],
        [answerId],
        [selectedOptionId],
        [isCorrect],
        [optionsLinked]
      )
      VALUES ( ?, ?, ?, ?, ? )
      RETURNING *;
    `
  },

  put: {
    query: `
      INSERT INTO [answer_attempt_table] (
        [answerAttemptId],
        [attemptId],
        [answerId],
        [selectedOptionId],
        [isCorrect],
        [optionsLinked]
      )
      VALUES ( ?, ?, ?, ?, ?, ? )
      ON CONFLICT(answerAttemptId) DO UPDATE SET 
            [attemptId] = excluded.[attemptId], 
            [answerId] = excluded.[answerId], 
            [selectedOptionId] = excluded.[selectedOptionId], 
            [isCorrect] = excluded.[isCorrect],
            [optionsLinked] = excluded.[optionsLinked]
      RETURNING *;
    `
  },

  deleteById: {
    query: `
      DELETE FROM [answer_attempt_table]
      WHERE [answerAttemptId] = ?;
    `
  }

};