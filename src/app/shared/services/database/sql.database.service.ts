import { Injectable } from "@angular/core";
import { WebSqlite } from 'angular-web-sqlite';
import {
    answer_attempt_table_script,
    answer_option_table_script,
    answer_table_script,
    AnswerDTO,
    AnswerOptionDTO,
    language_table_script,
    LanguageDTO,
    log_table_script,
    LogDTO,
    quiz_attempt_table_script,
    quiz_table_script,
    AttemptAnswerDTO,
    AttemptDTO,
    QuizDTO,
    settings_table_script,
    SettingsDTO,
    theme_table_script,
    ThemeDTO,
    user_table_script,
    UserDTO
} from "../../data/entities/dtos";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private dbName = 'sinexamSQL_temp0000004';
    private initialized = false;
    private isWeb: boolean = false;

    constructor(private webSqlite: WebSqlite) { }

    //#region CONFIG
    async initDataBase(): Promise<void> {
        if (this.initialized) return;
        try {
            await this.webSqlite.init(this.dbName);
            this.initialized = true;
        } catch (error) {
            console.error('Error al inicializar SQLite:', error);
            throw error;
        }
    }

    async executeQuery(query: string, parameters: any[] = []) {
        try {
            await this.initDataBase();
            const result = await this.webSqlite.executeSql(query, parameters);
            return result && result.rows ? result.rows : null;
        } catch (error) {
            console.info('ERROR:', error);
            return null
        }
    }

    async executeQueryBatch(queryBatch: [string, any[]][], parameters: any = {}) {
        try {
            await this.initDataBase();
            await this.webSqlite.batchSql(queryBatch);
            return await this.getStructure();
        } catch (error) {
            console.info('ERROR:', error);
            return null
        }
    }

    async loadStructure() {
        await this.initDataBase();
        try {

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

            return await this.executeQuery(fullScript);
        } catch (error) {
            console.info('ERROR:', error);
            return null
        }
    }

    async getStructure() {
        const query = `SELECT * FROM sqlite_master WHERE type='table';`;
        return await this.executeQuery(query);
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

        return await this.executeQueryBatch(initQueries);
    }

    //#endregion CONFIG

    // #region CRUDS

    //#region Logs (log_table)
    async getAllLogs() {
        const query = `SELECT * FROM log_table;`;
        return await this.executeQuery(query);
    }

    async getLogById(id: number) {
        const query = `SELECT * FROM log_table WHERE id = ?;`;
        return await this.executeQuery(query, [id]);
    }

    async postLog(log: LogDTO) {
        const query = `
        INSERT INTO log_table (id, date, content, type) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(id) DO UPDATE SET 
            date = excluded.date, 
            content = excluded.content, 
            type = excluded.type;`;
        return await this.executeQuery(query, [log.id ?? null, log.date, log.content, log.type]);
    }

    async deleteLog(id: number) {
        const query = `DELETE FROM log_table WHERE id = ?;`;
        return await this.executeQuery(query, [id]);
    }
    //#endregion

    //#region Languages (language_table)
    async getAllLanguages() {
        const query = `SELECT * FROM language_table;`;
        return await this.executeQuery(query);
    }

    async getLanguageByValue(value: string) {
        const query = `SELECT * FROM language_table WHERE value = ?;`;
        return await this.executeQuery(query, [value]);
    }

    async postLanguage(lang: LanguageDTO) {
        const query = `
        INSERT INTO language_table (value, name) 
        VALUES (?, ?) 
        ON CONFLICT(value) DO UPDATE SET name = excluded.name;`;
        return await this.executeQuery(query, [lang.value, lang.name]);
    }

    async deleteLanguage(value: string) {
        const query = `DELETE FROM language_table WHERE value = ?;`;
        return await this.executeQuery(query, [value]);
    }
    //#endregion

    //#region Users (user_table)
    async getAllUsers() {
        const query = `SELECT * FROM user_table;`;
        return await this.executeQuery(query);
    }

    async getUserById(userId: number) {
        const query = `SELECT * FROM user_table WHERE userId = ?;`;
        return await this.executeQuery(query, [userId]);
    }

    async getCurrentUser() {
        const query = `SELECT * FROM user_table WHERE current = 1 LIMIT 1;`;
        return await this.executeQuery(query);
    }

    async postUser(user: UserDTO) {
        const currentVal = user.current ? 1 : 0; // Convertir booleano a entero para SQLite
        const query = `
        INSERT INTO user_table (userId, uuid, userName, age, avatarUrl, avatarBody, current) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(userId) DO UPDATE SET 
            uuid = excluded.uuid,
            userName = excluded.userName, 
            age = excluded.age, 
            avatarUrl = excluded.avatarUrl, 
            avatarBody = excluded.avatarBody, 
            current = excluded.current;`;
        return await this.executeQuery(query, [user.userId ?? null, user.uuid, user.userName, user.age, user.avatarUrl, user.avatarBody, currentVal]);
    }

    async deleteUser(userId: number) {
        const query = `DELETE FROM user_table WHERE userId = ?;`;
        return await this.executeQuery(query, [userId]);
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

    async getAllSettings() {
        const query = `SELECT * FROM settings_table;`;
        const response = await this.executeQuery(query);
        return this.normalizeSettings(response);
    }

    async getSettingById(settingId: number) {
        const query = `SELECT * FROM settings_table WHERE settingId = ?;`;
        const response = await this.executeQuery(query, [settingId]);
        return this.normalizeSettings(response);
    }

    async getSettingCompleteById(settingId: number) {
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
            WHERE q.settingId = ?;`;
        const response = await this.executeQuery(query, [settingId]);
        return this.normalizeSettings(response);
    }

    async postSetting(setting: SettingsDTO) {
        setting.permissions = this.objectToString(setting.permissions)
        const query = `
        INSERT INTO settings_table (settingId, language, permissions, theme) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(settingId) DO UPDATE SET 
            language = excluded.language, 
            permissions = excluded.permissions, 
            theme = excluded.theme;`;
        return await this.executeQuery(query, [setting.settingId ?? null, setting.language, setting.permissions, setting.theme]);
    }

    async deleteSetting(settingId: number) {
        const query = `DELETE FROM settings_table WHERE settingId = ?;`;
        return await this.executeQuery(query, [settingId]);
    }
    //#endregion

    //#region Themes (theme_table)
    async getAllThemes() {
        const query = `SELECT * FROM theme_table;`;
        return await this.executeQuery(query);
    }

    async getTheme(id: string) {
        const query = `SELECT * FROM theme_table WHERE id = ?;`;
        return await this.executeQuery(query, [id]);
    }

    async postTheme(theme: ThemeDTO) {
        theme.content = this.objectToString(theme.content);
        const query = `
        INSERT INTO theme_table (id, content) 
        VALUES (?, ?) 
        ON CONFLICT(id) DO UPDATE SET content = excluded.content;`;
        return await this.executeQuery(query, [theme.id, theme.content]);
    }

    async deleteTheme(id: string) {
        const query = `DELETE FROM theme_table WHERE id = ?;`;
        return await this.executeQuery(query, [id]);
    }
    //#endregion

    //#region Quizzes (quiz_table)
    async getAllQuizzes() {
        const query = `SELECT * FROM quiz_table;`;
        return await this.executeQuery(query);
    }

    async getQuizById(quizId: number) {
        const query = `SELECT * FROM quiz_table WHERE quizId = ?;`;
        return await this.executeQuery(query, [quizId]);
    }

    async getQuizCompleteById(quizId: number) {
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
                        'title', a.title,
                        'updatedDate', a.updatedDate,
                        'options', (
                            SELECT json_group_array(
                                json_object(
                                    'optionId', o.optionId,
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
        WHERE q.quizId = ?;
    `;

        try {
            const result = await this.executeQuery(query, [quizId]);

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

    async postQuiz(quiz: QuizDTO) {
        const query = `
        INSERT INTO quiz_table (quizId, uuid, title, time, creationDate, updatedDate, startDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(quizId) DO UPDATE SET 
            uuid = excluded.uuid,
            title = excluded.title, 
            time = excluded.time, 
            creationDate = excluded.creationDate, 
            updatedDate = excluded.updatedDate, 
            startDate = excluded.startDate;`;
        return await this.executeQuery(query, [quiz.quizId ?? null, quiz.uuid, quiz.title, quiz.time, quiz.creationDate, quiz.updatedDate, quiz.startDate]);
    }

    async deleteQuiz(quizId: number) {
        // Nota: Debido a ON DELETE CASCADE en tu SQL, esto también borrará automáticamente
        // las preguntas (answers) y opciones vinculadas a este examen.
        const query = `DELETE FROM quiz_table WHERE quizId = ?;`;
        return await this.executeQuery(query, [quizId]);
    }
    //#endregion

    //#region Answers (answer_table)
    async getAllAnswers() {
        const query = `SELECT * FROM answer_table;`;
        return await this.executeQuery(query);
    }

    async getAnswersByQuiz(quizId: number) {
        const query = `SELECT * FROM answer_table WHERE quizId = ?;`;
        return await this.executeQuery(query, [quizId]);
    }

    async postAnswer(answer: AnswerDTO) {
        const query = `
        INSERT INTO answer_table (answerId, quizId, title, updatedDate) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(answerId) DO UPDATE SET 
            quizId = excluded.quizId, 
            title = excluded.title, 
            updatedDate = excluded.updatedDate;`;
        return await this.executeQuery(query, [answer.answerId ?? null, answer.quizId, answer.title, answer.updatedDate]);
    }

    async deleteAnswer(answerId: number) {
        const query = `DELETE FROM answer_table WHERE answerId = ?;`;
        return await this.executeQuery(query, [answerId]);
    }
    //#endregion

    //#region Answer Options (answer_option_table)
    async getOptionsByAnswer(answerId: number) {
        const query = `SELECT * FROM answer_option_table WHERE answerId = ? ORDER BY optionIndex ASC;`;
        return await this.executeQuery(query, [answerId]);
    }

    async postAnswerOption(option: AnswerOptionDTO) {
        const correctVal = option.isCorrect ? 1 : 0;
        const query = `
        INSERT INTO answer_option_table (optionId, answerId, content, optionIndex, updatedDate, isCorrect) 
        VALUES (?, ?, ?, ?, ?, ?) 
        ON CONFLICT(optionId) DO UPDATE SET 
            answerId = excluded.answerId, 
            content = excluded.content, 
            optionIndex = excluded.optionIndex, 
            updatedDate = excluded.updatedDate, 
            isCorrect = excluded.isCorrect;`;
        return await this.executeQuery(query, [option.optionId ?? null, option.answerId, option.content, option.optionIndex, option.updatedDate, correctVal]);
    }

    async deleteAnswerOption(optionId: number) {
        const query = `DELETE FROM answer_option_table WHERE optionId = ?;`;
        return await this.executeQuery(query, [optionId]);
    }
    //#endregion

    //#region Quiz Attempts (quiz_attempt_table)
    async getAttemptsByUser(userId: number) {
        const query = `SELECT * FROM quiz_attempt_table WHERE userId = ?;`;
        return await this.executeQuery(query, [userId]);
    }

    async getAttemptById(attemptId: number) {
        const query = `SELECT * FROM quiz_attempt_table WHERE attemptId = ?;`;
        return await this.executeQuery(query, [attemptId]);
    }

    async postQuizAttempt(attempt: AttemptDTO) {
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
            state = excluded.state;`;
        return await this.executeQuery(query, [attempt.attemptId ?? null, attempt.quizId, attempt.userId, attempt.creationDate, attempt.updatedDate, attempt.score]);
    }

    async deleteQuizAttempt(attemptId: number) {
        const query = `DELETE FROM quiz_attempt_table WHERE attemptId = ?;`;
        return await this.executeQuery(query, [attemptId]);
    }
    //#endregion

    //#region Answer Attempts (answer_attempt_table)
    async getAnswerAttemptsByAttempt(attemptId: number) {
        const query = `SELECT * FROM answer_attempt_table WHERE attemptId = ?;`;
        return await this.executeQuery(query, [attemptId]);
    }

    async postAnswerAttempt(ansAttempt: AttemptAnswerDTO) {
        const correctVal = ansAttempt.isCorrect ? 1 : 0;
        const query = `
        INSERT INTO answer_attempt_table (answerAttemptId, attemptId, answerId, selectedOptionId, isCorrect) 
        VALUES (?, ?, ?, ?, ?) 
        ON CONFLICT(answerAttemptId) DO UPDATE SET 
            attemptId = excluded.attemptId, 
            answerId = excluded.answerId, 
            selectedOptionId = excluded.selectedOptionId, 
            isCorrect = excluded.isCorrect;`;
        return await this.executeQuery(query, [ansAttempt.answerAttemptId ?? null, ansAttempt.attemptId, ansAttempt.answerId, ansAttempt.selectedOptionId, correctVal]);
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
