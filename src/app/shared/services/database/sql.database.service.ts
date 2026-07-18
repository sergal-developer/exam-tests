import { Injectable } from "@angular/core";
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import {
    answer_attempt_table_script,
    answer_option_table_script,
    answer_table_script,
    AnswerDTO,
    AnswerOptionDTO,
    AttemptAnswerDTO,
    AttemptDTO,
    language_table_script,
    LanguageDTO,
    log_table_script,
    LogDTO,
    quiz_attempt_table_script,
    quiz_table_script,
    QuizDTO,
    settings_table_script,
    SettingsDTO,
    theme_table_script,
    ThemeDTO,
    user_table_script,
    UserDTO
} from "../../data/entities/dtos";
import { UiServices } from "../ui.services";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private dbName = 'sinexamSQL_temp0000005';
    private initialized = false;
    private isAndroid: boolean = false;

    private db: SQLiteDBConnection;
    private sqliteConnection!: SQLiteConnection;

    constructor(
        private _uiServices: UiServices,
    ) {
        this.isAndroid = Capacitor.getPlatform() === 'android';
        this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    }

    //#region CONFIG
    private async _initWebStore(): Promise<boolean> {
        try {
            if (!this.isAndroid) {
                const jeepEl = document.querySelector('jeep-sqlite');
                if (jeepEl) {
                    await this.sqliteConnection.initWebStore();
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (err: any) {
            return Promise.reject(`initWebStore: ${err}`);
        }
    }

    private async _openDatabase(dbName: string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<any> {
        const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;
        let isConn = (await this.sqliteConnection.isConnection(dbName, readonly)).result;
        if (retCC && isConn) {
            this.db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
        } else {
            this.db = await this.sqliteConnection.createConnection(dbName, encrypted, mode, version, readonly);
        }
        await this.db.open();
        return this.db;
    }

    async initDataBase() {
        await this._initWebStore().then(async (webConnection) => {
            await this._openDatabase(this.dbName,
                false,          // encrypted
                'no-encryption',
                1,              // version
                false           // readonly
            );
            if (!this.isAndroid && webConnection) {
                await this.sqliteConnection.saveToStore(this.dbName);
            }
        });

    }

    async executeSQL(query: string): Promise<any[]> {
        try {
            await this.initDataBase();
            const request = await this.db.execute(query);
            if (!this.isAndroid) {
                await this.sqliteConnection.saveToStore(this.dbName);
            }
            return request && request.changes ? request.changes.values : null;
        } catch (error) {
            console.info('ERROR:', error);
            this._uiServices.notification('ERROR EXEC: ' + JSON.stringify(error))
            return null
        }
    }

    async querySQL(query: string, parameters: any[] = []): Promise<any[]> {
        try {
            await this.initDataBase();
            const request = await this.db.query(query, parameters);
            console.log('querySQL: ', request);
            if (!this.isAndroid) {
                await this.sqliteConnection.saveToStore(this.dbName);
            }
            return request && request.values ? request.values : null;
        } catch (error) {
            console.info('ERROR:', error);
            this._uiServices.notification('ERROR EXEC: ' + JSON.stringify(error))
            return null
        }

    }

    async querySQLBatch(queryBatch: [string, any[]][], parameters: any = {}): Promise<any[]> {
        try {
            await this.initDataBase();
            // await this.nativeDb.batchSql(queryBatch);
            return await this.getStructure();
        } catch (error) {
            console.info('ERROR:', error);
            this._uiServices.notification('ERROR EXEC: ' + JSON.stringify(error))
            return null
        }
    }

    async loadStructure() {
        await this.initDataBase();
        try {
            await this.db.execute('PRAGMA foreign_keys = ON;');
            const fullScript =
                log_table_script +
                language_table_script +
                user_table_script +
                settings_table_script +
                theme_table_script +
                quiz_table_script +
                answer_table_script +
                answer_option_table_script +
                quiz_attempt_table_script +
                answer_attempt_table_script;

            return await this.executeSQL(fullScript);
            
        } catch (error) {
            console.info('ERROR:', error);
            return null
        }
    }

    async getStructure() {
        const query = `SELECT * FROM sqlite_master WHERE type='table';`;
        const data = await this.querySQL(query);
        console.log('data: ', data);
        return data;
    }

    async deleteStructure() {
        const initQueries: [string, any[]][] = [
            ['DELETE FROM log_table;', []],
            ['DELETE FROM language_table;', []],
            ['DELETE FROM profile_table;', []],
            ['DELETE FROM quiz_table;', []],
            ['DELETE FROM settings_table;', []],
            ['DELETE FROM theme_table;', []]
        ];

        return await this.querySQLBatch(initQueries);
    }
    //#endregion CONFIG

    //#region CRUDS

    //#region Logs (log_table)
    async getAllLogs(): Promise<LogDTO[]> {
        const query = `SELECT * FROM log_table;`;
        return await this.querySQL(query);
    }

    async getLogById(id: number): Promise<LogDTO[]> {
        const query = `SELECT * FROM log_table WHERE id = ?;`;
        return await this.querySQL(query, [id]);
    }

    async postLog(log: LogDTO): Promise<LogDTO> {
        const query = `
        INSERT INTO log_table (id, date, content, type) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(id) DO UPDATE SET 
            date = excluded.date, 
            content = excluded.content, 
            type = excluded.type
        RETURNING *;`;
        const response = await this.querySQL(query, [log.id ?? null, log.date, log.content, log.type]);
        return response && response.length ? response[0] : null;
    }

    async deleteLog(id: number): Promise<LogDTO[]> {
        const query = `DELETE FROM log_table WHERE id = ?;`;
        return await this.querySQL(query, [id]);
    }
    //#endregion

    //#region Languages (language_table)
    async getAllLanguages(): Promise<LanguageDTO[]> {
        const query = `SELECT * FROM language_table;`;
        return await this.querySQL(query);
    }

    async getLanguageByValue(value: string): Promise<LanguageDTO> {
        const query = `SELECT * FROM language_table WHERE value = ?;`;
        const response = await this.querySQL(query, [value]);
        return response && response.length ? response[0] : null;
    }

    async postLanguage(lang: LanguageDTO): Promise<LanguageDTO[]> {
        const query = `
        INSERT INTO language_table (value, name) 
        VALUES (?, ?) 
        ON CONFLICT(value) DO UPDATE SET name = excluded.name
        RETURNING *;`;
        const response = await this.querySQL(query, [lang.value, lang.name]);
        return response && response.length ? response[0] : null;
    }

    async deleteLanguage(value: string): Promise<LanguageDTO[]> {
        const query = `DELETE FROM language_table WHERE value = ?;`;
        return await this.querySQL(query, [value]);
    }
    //#endregion

    //#region Users (user_table)
    async getAllUsers(): Promise<UserDTO[]> {
        const query = `SELECT * FROM user_table;`;
        return await this.querySQL(query);
    }

    async getUserById(userId: number): Promise<UserDTO> {
        const query = `SELECT * FROM user_table WHERE userId = ?;`;
        const response = await this.querySQL(query, [userId]);
        return response && response.length ? response[0] : null;
    }

    async getCurrentUser(): Promise<UserDTO> {
        const query = `SELECT * FROM user_table WHERE current = 1 LIMIT 1;`;
        const response = await this.querySQL(query);
        console.log('response: ', response);
        return response && response.length ? response[0] : null;
    }

    async saveUser(user: UserDTO): Promise<UserDTO> {
        let response: UserDTO = null;
        if (!user.userId) {
            response = await this._postUser(user);
        } else {
            response = await this._putUser(user);
        }
        return response;
    }

    private async _postUser(user: UserDTO): Promise<UserDTO> {
        
        const query = `
        INSERT INTO user_table (uuid, userName, age, avatarUrl, avatarBody, current) 
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *;`;

        const values = [
            user.uuid ?? null, 
            user.userName, 
            user.age ?? null, 
            user.avatarUrl ?? null,                 // Evita el undefined
            user.avatarBody ? JSON.stringify(user.avatarBody) : null, // Por si es objeto
            user.current ? 1 : 0                    // Booleano a Entero (1 o 0)
        ];

        const response = await this.querySQL(query, values);
        console.log('response: ', response);
        return response && response.length ? response[0] : null;
    }

    private async _putUser(user: UserDTO): Promise<UserDTO> {
        
        const query = `
        INSERT INTO user_table (userId, uuid, userName, age, avatarUrl, avatarBody, current) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(userId) DO UPDATE SET 
            uuid = excluded.uuid,
            userName = excluded.userName, 
            age = excluded.age, 
            avatarUrl = excluded.avatarUrl, 
            avatarBody = excluded.avatarBody, 
            current = excluded.current
        RETURNING *;`;

        const values = [
            user.userId ?? null,
            user.uuid ?? null, 
            user.userName, 
            user.age ?? null, 
            user.avatarUrl ?? null,                 // Evita el undefined
            user.avatarBody ? JSON.stringify(user.avatarBody) : null, // Por si es objeto
            user.current ? 1 : 0                    // Booleano a Entero (1 o 0)
        ];

        const response = await this.querySQL(query, values);
        console.log('response: ', response);
        return response && response.length ? response[0] : null;
    }

    async deleteUser(userId: number): Promise<UserDTO[]> {
        const query = `DELETE FROM user_table WHERE userId = ${ userId };`;
        return await this.querySQL(query);
    }
    //#endregion

    //#region Settings (settings_table)
    private normalizeSettings(datalist: Array<any>) {
        if (datalist && datalist.length) {
            datalist.map(x => {
                x.permissions = x.permissions ? this.stringToObject(x.permissions) : {};
                x._languages = x._languages ? this.stringToObject(x._languages) : [];
                x._themes = x._themes ? this.stringToObject(x._themes) : [];

                if (x._themes.length) {
                    x._themes.map(y => {
                        y.content = y.content ? this.stringToObject(y.content) : [];
                    })
                }
            });
        }
        return datalist;
    }

    async getAllSettings(): Promise<SettingsDTO[]> {
        const query = `SELECT * FROM settings_table;`;
        const response = await this.querySQL(query);
        return this.normalizeSettings(response);
    }

    async getSettingById(settingId: number): Promise<SettingsDTO> {
        const query = `SELECT * FROM settings_table WHERE settingId = ${ settingId };`;
        let response = await this.querySQL(query,);
        response = this.normalizeSettings(response);
        return response && response.length ? response[0] : null;
    }

    async getSettingCompleteById(settingId: number): Promise<SettingsDTO> {
        const query =
            `SELECT 
                q.settingId,
                q.language,
                q.permissions,
                q.theme,
                (
                    SELECT json_group_array(
                        json_object(
                            'value', l.value,
                            'name', l.name
                        )
                    ) FROM language_table l
                ) as _languages,
                (
                    SELECT json_group_array(
                        json_object(
                            'id', t.id,
                            'content', t.content
                        )
                    ) FROM theme_table t
                ) as _themes
            FROM settings_table q 
            WHERE q.settingId = ${ settingId };`;
        let response = await this.querySQL(query);
        response = this.normalizeSettings(response);
        return response && response.length ? response[0] : null;
    }

    async postSetting(setting: SettingsDTO): Promise<SettingsDTO> {
        setting.permissions = this.objectToString(setting.permissions)
        const query = `
        INSERT INTO settings_table (settingId, language, permissions, theme) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(settingId) DO UPDATE SET 
            language = excluded.language, 
            permissions = excluded.permissions, 
            theme = excluded.theme
        RETURNING *;`;
        const response = await this.querySQL(query, [setting.settingId ?? null, setting.language, setting.permissions, setting.theme]);
        return response && response.length ? response[0] : null;
    }

    async deleteSetting(settingId: number): Promise<SettingsDTO[]> {
        const query = `DELETE FROM settings_table WHERE settingId = ?;`;
        return await this.querySQL(query, [settingId]);
    }
    //#endregion

    //#region Themes (theme_table)
    async getAllThemes(): Promise<ThemeDTO[]> {
        const query = `SELECT * FROM theme_table;`;
        return await this.querySQL(query);
    }

    async getTheme(id: string): Promise<ThemeDTO> {
        const query = `SELECT * FROM theme_table WHERE id = ?;`;
        const response = await this.querySQL(query, [id]);
        return response && response.length ? response[0] : null;
    }

    async postTheme(theme: ThemeDTO): Promise<ThemeDTO> {
        theme.content = this.objectToString(theme.content);
        const query = `
        INSERT INTO theme_table (id, content) 
        VALUES (?, ?) 
        ON CONFLICT(id) DO UPDATE SET content = excluded.content
        RETURNING *;`;
        const response = await this.querySQL(query, [theme.id, theme.content]);
        return response && response.length ? response[0] : null;
    }

    async deleteTheme(id: string): Promise<ThemeDTO[]> {
        const query = `DELETE FROM theme_table WHERE id = ?;`;
        return await this.querySQL(query, [id]);
    }
    //#endregion

    //#region Quizzes (quiz_table)
    async getAllQuizzes(): Promise<QuizDTO[]> {
        const query = `SELECT * FROM quiz_table;`;
        return await this.querySQL(query);
    }

    async getQuizById(quizId: number): Promise<QuizDTO> {
        const query = `SELECT * FROM quiz_table WHERE quizId = ?;`;
        const response = await this.querySQL(query, [quizId]);
        return response && response.length ? response[0] : null;
    }

    async getQuizCompleteById(quizId: number): Promise<QuizDTO> {
        const query = `
        SELECT 
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
                )qq
                FROM answer_table a
                WHERE a.quizId = q.quizId
            ) as answers
        FROM quiz_table q
        WHERE q.quizId = ?;`;

        try {
            const result = await this.querySQL(query, [quizId]);

            if (result && result.length > 0) {
                const quiz = result[0];
                // Como SQLite devuelve los grupos JSON como cadenas de texto, 
                // los parseamos para que vuelvan a ser arrays/objetos de JavaScript nativos.
                if (typeof quiz.answers === 'string') {
                    quiz.answers = JSON.parse(quiz.answers);
                }
                return quiz;
            }
            return null;
        } catch (error) {
            console.error('Error al mapear el Quiz completo:', error);
            return null;
        }
    }

    async saveQuiz(quiz: QuizDTO): Promise<QuizDTO> {
        let response: QuizDTO = null;
        if (!quiz.quizId) {
            response = await this._postQuiz(quiz);
        } else {
            response = await this._putQuiz(quiz);
        }
        return response;
    }

    private async _postQuiz(quiz: QuizDTO): Promise<QuizDTO> {
        const query = `
        INSERT INTO quiz_table (uuid, title, time, creationDate, updatedDate, startDate) 
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *;`;
        const response = await this.querySQL(query, [quiz.uuid, quiz.title, quiz.time, quiz.creationDate, quiz.updatedDate, quiz.startDate]);
        return response && response.length ? response[0] : null;
    }

    private async _putQuiz(quiz: QuizDTO): Promise<QuizDTO> {
        const query = `
        INSERT INTO quiz_table (quizId, uuid, title, time, creationDate, updatedDate, startDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(quizId) DO UPDATE SET 
            uuid = excluded.uuid,
            title = excluded.title, 
            time = excluded.time, 
            creationDate = excluded.creationDate, 
            updatedDate = excluded.updatedDate, 
            startDate = excluded.startDate
        RETURNING *;`;
        const response = await this.querySQL(query, [quiz.quizId ?? null, quiz.uuid, quiz.title, quiz.time, quiz.creationDate, quiz.updatedDate, quiz.startDate]);
        return response && response.length ? response[0] : null;
    }

    async deleteQuiz(quizId: number): Promise<QuizDTO[]> {
        // Nota: Debido a ON DELETE CASCADE en tu SQL, esto también borrará automáticamente
        // las preguntas (answers) y opciones vinculadas a este examen.
        const query = `DELETE FROM quiz_table WHERE quizId = ?;`;
        return await this.querySQL(query, [quizId]);
    }
    //#endregion

    //#region Answers (answer_table)
    async getAllAnswers(): Promise<AnswerDTO[]> {
        const query = `SELECT * FROM answer_table;`;
        return await this.querySQL(query);
    }

    async getAnswersByQuiz(quizId: number): Promise<AnswerDTO> {
        const query = `SELECT * FROM answer_table WHERE quizId = ?;`;
        const response = await this.querySQL(query, [quizId]);
        return response && response.length ? response[0] : null;
    }

    async saveAnswer(answer: AnswerDTO): Promise<AnswerDTO> {
        let response: AnswerDTO = null;
        if (!answer.answerId) {
            response = await this._postAnswer(answer);
        } else {
            response = await this._putAnswer(answer);
        }
        return response;
    }

    private async _postAnswer(answer: AnswerDTO): Promise<AnswerDTO> {
        const query = `
        INSERT INTO answer_table (quizId, title, updatedDate) 
        VALUES (?, ?, ?)
        RETURNING *;`;
        const response = await this.querySQL(query, [answer.quizId, answer.title, answer.updatedDate]);
        return response && response.length ? response[0] : null;
    }

    private async _putAnswer(answer: AnswerDTO): Promise<AnswerDTO> {
        const query = `
        INSERT INTO answer_table (answerId, quizId, title, updatedDate) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(answerId) DO UPDATE SET 
            quizId = excluded.quizId, 
            title = excluded.title, 
            updatedDate = excluded.updatedDate
        RETURNING *;`;
        const response = await this.querySQL(query, [answer.answerId ?? null, answer.quizId, answer.title, answer.updatedDate]);
        return response && response.length ? response[0] : null;
    }

    async deleteAnswer(answerId: number): Promise<AnswerDTO[]> {
        const query = `DELETE FROM answer_table WHERE answerId = ?;`;
        return await this.querySQL(query, [answerId]);
    }
    //#endregion

    //#region Answer Options (answer_option_table)
    async getOptionsByAnswer(answerId: number): Promise<AnswerOptionDTO[]> {
        const query = `SELECT * FROM answer_option_table WHERE answerId = ? ORDER BY optionIndex ASC;`;
        return await this.querySQL(query, [answerId]);
    }

    async saveAnswerOption(option: AnswerOptionDTO): Promise<AnswerOptionDTO> {
        let response: AnswerOptionDTO = null;
        if (!option.optionId) {
            response = await this._postAnswerOption(option);
        } else {
            response = await this._putAnswerOption(option);
        }
        return response;
    }

    private async _postAnswerOption(option: AnswerOptionDTO): Promise<AnswerOptionDTO> {
        const correctVal = option.isCorrect ? 1 : 0;
        const query = `
        INSERT INTO answer_option_table (answerId, content, optionIndex, updatedDate, isCorrect) 
        VALUES (?, ?, ?, ?, ?)
        RETURNING *;`;
        const response = await this.querySQL(query, [option.answerId, option.content, option.optionIndex, option.updatedDate, correctVal]);
        return response && response.length ? response[0] : null;
    }

    private async _putAnswerOption(option: AnswerOptionDTO): Promise<AnswerOptionDTO> {
        const correctVal = option.isCorrect ? 1 : 0;
        const query = `
        INSERT INTO answer_option_table (optionId, answerId, content, optionIndex, updatedDate, isCorrect) 
        VALUES (?, ?, ?, ?, ?, ?) 
        ON CONFLICT(optionId) DO UPDATE SET 
            answerId = excluded.answerId, 
            content = excluded.content, 
            optionIndex = excluded.optionIndex, 
            updatedDate = excluded.updatedDate, 
            isCorrect = excluded.isCorrect
        RETURNING *;`;
        const response = await this.querySQL(query, [option.optionId ?? null, option.answerId, option.content, option.optionIndex, option.updatedDate, correctVal]);
        return response && response.length ? response[0] : null;
    }

    async deleteAnswerOption(optionId: number): Promise<AnswerOptionDTO[]> {
        const query = `DELETE FROM answer_option_table WHERE optionId = ?;`;
        return await this.querySQL(query, [optionId]);
    }
    //#endregion

    //#region Quiz Attempts (quiz_attempt_table)
    async getAttemptsByUser(userId: number): Promise<AttemptDTO[]> {
        const query = `SELECT * FROM quiz_attempt_table WHERE userId = ?;`;
        return await this.querySQL(query, [userId]);
    }

    async getAttemptById(attemptId: number): Promise<AttemptDTO> {
        const query = `SELECT * FROM quiz_attempt_table WHERE attemptId = ?;`;
        const response = await this.querySQL(query, [attemptId]);
        return response && response.length ? response[0] : null;
    }

    async saveQuizAttempt(attempt: AttemptDTO): Promise<AttemptDTO> {
        let response: AttemptDTO = null;
        if (!attempt.attemptId) {
            response = await this._postQuizAttempt(attempt);
        } else {
            response = await this._putQuizAttempt(attempt);
        }
        return response;
    }

    private async _postQuizAttempt(attempt: AttemptDTO): Promise<AttemptDTO> {
        const query = `
        INSERT INTO quiz_attempt_table (quizId, userId, title, creationDate, updatedDate, score, state) 
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *;`;
        const response = await this.querySQL(query, [attempt.quizId, attempt.userId, attempt.creationDate, attempt.updatedDate, attempt.score]);
        return response && response.length ? response[0] : null;
    }

    private async _putQuizAttempt(attempt: AttemptDTO): Promise<AttemptDTO> {
        const query = `
        INSERT INTO quiz_attempt_table (attemptId, quizId, userId, title, creationDate, updatedDate, score, state) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(attemptId) DO UPDATE SET 
            quizId = excluded.quizId, 
            userId = excluded.userId,
            title = excluded.title,
            creationDate = excluded.creationDate, 
            updatedDate = excluded.updatedDate, 
            score = excluded.score,
            state = excluded.state
        RETURNING *;`;
        const response = await this.querySQL(query, [attempt.attemptId ?? null, attempt.quizId, attempt.userId, attempt.creationDate, attempt.updatedDate, attempt.score]);
        return response && response.length ? response[0] : null;
    }

    async deleteQuizAttempt(attemptId: number): Promise<AttemptDTO[]> {
        const query = `DELETE FROM quiz_attempt_table WHERE attemptId = ?;`;
        return await this.querySQL(query, [attemptId]);
    }
    //#endregion

    //#region Answer Attempts (answer_attempt_table)
    async getAnswerAttemptsByAttempt(attemptId: number): Promise<AttemptAnswerDTO[]> {
        const query = `SELECT * FROM answer_attempt_table WHERE attemptId = ?;`;
        return await this.querySQL(query, [attemptId]);
    }

    async saveAnswerAttempt(ansAttempt: AttemptAnswerDTO): Promise<AttemptAnswerDTO> {
        let response: AttemptAnswerDTO = null;
        if (!ansAttempt.attemptId) {
            response = await this._postAnswerAttempt(ansAttempt);
        } else {
            response = await this._putAnswerAttempt(ansAttempt);
        }
        return response;
    }

    private async _postAnswerAttempt(ansAttempt: AttemptAnswerDTO): Promise<AttemptAnswerDTO> {
        const correctVal = ansAttempt.isCorrect ? 1 : 0;
        const query = `
        INSERT INTO answer_attempt_table (attemptId, answerId, selectedOptionId, isCorrect) 
        VALUES (?, ?, ?, ?)
        RETURNING *;`;
        const response = await this.querySQL(query, [ansAttempt.attemptId, ansAttempt.answerId, ansAttempt.selectedOptionId, correctVal]);
        return response && response.length ? response[0] : null;
    }

    private async _putAnswerAttempt(ansAttempt: AttemptAnswerDTO): Promise<AttemptAnswerDTO> {
        const correctVal = ansAttempt.isCorrect ? 1 : 0;
        const query = `
        INSERT INTO answer_attempt_table (answerAttemptId, attemptId, answerId, selectedOptionId, isCorrect) 
        VALUES (?, ?, ?, ?, ?) 
        ON CONFLICT(answerAttemptId) DO UPDATE SET 
            attemptId = excluded.attemptId, 
            answerId = excluded.answerId, 
            selectedOptionId = excluded.selectedOptionId, 
            isCorrect = excluded.isCorrect
        RETURNING *;`;
        const response = await this.querySQL(query, [ansAttempt.answerAttemptId ?? null, ansAttempt.attemptId, ansAttempt.answerId, ansAttempt.selectedOptionId, correctVal]);
        return response && response.length ? response[0] : null;
    }
    //#endregion

    //#endregion CRUDS


    //#region CONVERTERS
    objectToString(obj: any): string {
        return JSON.stringify(obj)
    }

    stringToObject(obj: string): any {
        return JSON.parse(obj)
    }
    //#endregion CONVERTERS

}
