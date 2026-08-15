import { Injectable } from "@angular/core";
import { CapacitorSQLite, DBSQLiteValues, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import {
    answer_attempt_table_querys,
    answer_option_table_querys,
    answer_table_querys,
    AnswerDTO,
    AnswerOptionDTO,
    AttemptAnswerDTO,
    AttemptDTO,
    language_table_querys,
    LanguageDTO,
    log_table_querys,
    LogDTO,
    quiz_attempt_table_querys,
    quiz_table_querys,
    QuizDTO,
    settings_table_querys,
    SettingsDTO,
    theme_table_querys,
    ThemeDTO,
    user_table_querys,
    UserDTO
} from "../../data/entities/dtos";
import { UiServices } from "../ui.services";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private dbName = 'sinexamSQL_temp';
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

    private async _openDatabaseCreate(dbName: string, encrypted: boolean = false, mode: string = 'no-encryption', version: number = 1, readonly: boolean = false): Promise<any> {
        const isConn = (await this.sqliteConnection.isConnection(dbName, readonly)).result;
        if (isConn) {
            this.db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
        } else {
            this.db = await this.sqliteConnection.createConnection(dbName, encrypted, mode, version, readonly);
        }
        await this.db.open();
        return this.db;
    }

    async initDataBase(): Promise<any> {
        await this._initWebStore().then(async (webConnection) => {
            this.db = await this._openDatabaseCreate(this.dbName);
            if (!this.isAndroid) {
                await this.sqliteConnection.saveToStore(this.dbName);
            }
        });
        return this.db;
    }

    /**
     * Divide un script SQL en sentencias individuales.
     * En Android el plugin nativo usa ";\n" como separador, por lo que
     * las sentencias deben ejecutarse una a una.
     */
    splitStatements(statementSql: string): string[] {
        if (!statementSql) return [];
        return statementSql
            .split(';')
            .map(s => s.replace(/\n+/g, '\n').trim())
            .filter(s => s.length > 0)
            .map(s => (s.endsWith(';') ? s : s + ';'));
    }

    /**
     * Ejecuta un conjunto de sentencia SQL directamente contra la base de datos.
     * sus usos son para creacion de tablas o batchs
     *
     * @param statementSql Sentencia SQL que se desea ejecutar.
     * @returns El resultado de la ejecución de la sentencia.
     */
    async executeSQL(statementSql: string): Promise<any> {
        try {
            this.db = await this.initDataBase();
            let request;
            if (this.isAndroid) {
                // El plugin nativo de Android divide las sentencias por ";\n".
                // Si el script contiene varias sentencias, se ejecutan una a una.
                const statements = this.splitStatements(statementSql);
                let changes = 0;
                for (const stmt of statements) {
                    console.log('stmt: ', stmt);
                    const res = await this.db.execute(stmt);
                    if (res && res.changes && res.changes.changes) {
                        changes += res.changes.changes;
                    }
                }
                request = { changes: { changes } };
                console.log('request: ', request);
            } else {
                request = await this.db.execute(statementSql);
                await this.sqliteConnection.saveToStore(this.dbName);
            }
            return request;
        } catch (error) {
            console.info('ERROR:', error);
            this._uiServices.notification('ERROR EXEC: ' + JSON.stringify(error))
            return null
        }
    }

    /**
     * Ejecuta una sentencia de accion (post,put,delete) en SQL parametrizada contra la base de datos.
     *
     * @param statementSql Sentencia SQL con placeholders para los parámetros (?, ?).
     * @param parameters Valores que serán utilizados para reemplazar los placeholders.
     * @returns retorna un Arrglo de datos o un nulo si no hay valores
     */
    async executeActionSQL(statementSql: string, parameters: any[] = []): Promise<any> {
        try {
            this.db = await this.initDataBase();
            const statements = this.splitStatements(statementSql);
            const request: DBSQLiteValues = await this.db.query(statementSql, parameters);
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

    /**
     * Ejecuta una sentencia SQL de consulta (GET) parametrizada y devuelve los registros
     * obtenidos.
     *
     * @param statementSql Sentencia SQL SELECT con placeholders para los parámetros (?, ?).
     * @param parameters Valores que serán utilizados para reemplazar los placeholders.
     * @returns retorna un Arrglo de datos o un nulo si no hay valores
     */
    async executeInSQL(statementSql: string, parameters: any[] = [], log: Function = null): Promise<any> {
        let _log = '';
        try {
            this.db = await this.initDataBase();
            const request = await this.db.query(statementSql, parameters);
            if (!this.isAndroid) {
                await this.sqliteConnection.saveToStore(this.dbName);
            }

            if (log) {
                log(null);
            }
            return request && request.values ? request.values : null;
        } catch (error) {
            console.info('ERROR:', error);
            this._uiServices.notification('ERROR EXEC: ' + error);

            if (log) {
                log(error);
            }
            return null
        }
    }

    async initialDatabase() {
        await this.createDataStructure();
        const structure = await this.getStructure()
        if (!structure) {
            this._uiServices.notification("Error al establecer conexion SQL.", { type: 'error', closeTimer: 0 })
        }
        return structure ? true : false;
    }

    async createDataStructure() {
        try {
            await this.executeSQL('PRAGMA foreign_keys = ON;');

            const tableScripts = [
                log_table_querys.createTable.query,
                language_table_querys.createTable.query,
                user_table_querys.createTable.query,
                settings_table_querys.createTable.query,
                theme_table_querys.createTable.query,
                quiz_table_querys.createTable.query,
                answer_table_querys.createTable.query,
                answer_option_table_querys.createTable.query,
                quiz_attempt_table_querys.createTable.query,
                answer_attempt_table_querys.createTable.query,
            ];

            for (const script of tableScripts) {
                const result = await this.executeSQL(script);
                if (result === null) {
                    return null;
                }
            }
            return true;

        } catch (error) {
            console.info('ERROR:', error);
            return null;
        }
    }

    async getStructure() {
        const query = `SELECT * FROM sqlite_master WHERE type='table';`;
        const data = await this.executeActionSQL(query);
        return data;
    }

    async deleteStructure() {
        try {

            const tableScripts = [
                answer_attempt_table_querys.deleteTable.query,
                quiz_attempt_table_querys.deleteTable.query,
                answer_option_table_querys.deleteTable.query,
                answer_table_querys.deleteTable.query,
                quiz_table_querys.deleteTable.query,
                language_table_querys.deleteTable.query,
                theme_table_querys.deleteTable.query,
                settings_table_querys.deleteTable.query,
                user_table_querys.deleteTable.query,
                log_table_querys.deleteTable.query,
            ];

            for (const script of tableScripts) {
                const result = await this.executeSQL(script);
                if (result === null) {
                    return null;
                }
            }
            return true;

        } catch (error) {
            console.info('ERROR:', error);
            return null;
        }

    }
    //#endregion CONFIG

    //#region CRUDS

    //#region Logs (log_table)
    async getAllLogs(): Promise<LogDTO[]> {
        return await this.executeActionSQL(log_table_querys.selectAll.query);
    }

    async getLogById(id: number): Promise<LogDTO[]> {
        return await this.executeActionSQL(log_table_querys.selectById.query, [id]);
    }

    async postLog(log: LogDTO): Promise<LogDTO> {
        const response = await this.executeActionSQL(log_table_querys.post.query, [log.id ?? null, log.date, log.content, log.type]);
        return response && response.length ? response[0] : null;
    }

    async deleteLog(id: number): Promise<LogDTO[]> {
        return await this.executeActionSQL(log_table_querys.deleteById.query, [id]);
    }
    //#endregion

    //#region Languages (language_table)
    async getAllLanguages(): Promise<LanguageDTO[]> {
        return await this.executeActionSQL(language_table_querys.selectAll.query);
    }

    async getLanguageByValue(value: string): Promise<LanguageDTO> {
        const response = await this.executeActionSQL(language_table_querys.selectById.query, [value]);
        return response && response.length ? response[0] : null;
    }

    async postLanguage(lang: LanguageDTO): Promise<LanguageDTO[]> {
        const response = await this.executeActionSQL(language_table_querys.post.query, [lang.value, lang.name]);
        return response && response.length ? response[0] : null;
    }

    async deleteLanguage(value: string): Promise<LanguageDTO[]> {
        return await this.executeActionSQL(language_table_querys.deleteById.query, [value]);
    }
    //#endregion

    //#region Users (user_table)
    async getAllUsers(): Promise<UserDTO[]> {
        return await this.executeActionSQL(user_table_querys.selectAll.query);
    }

    async getUserById(userId: number): Promise<UserDTO> {
        const response = await this.executeActionSQL(user_table_querys.selectById.query, [userId]);
        return response && response.length ? response[0] : null;
    }

    async getCurrentUser(): Promise<UserDTO> {
        const response = await this.executeActionSQL(user_table_querys.selectByCurrent.query);
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
        const values = [
            user.uuid ?? null,
            user.userName,
            user.age ?? null,
            user.avatarUrl ?? null,                 // Evita el undefined
            user.avatarBody ? JSON.stringify(user.avatarBody) : null, // Por si es objeto
            user.current ? 1 : 0                    // Booleano a Entero (1 o 0)
        ];

        const response = await this.executeActionSQL(user_table_querys.post.query, values);
        return response && response.length ? response[0] : null;
    }

    private async _putUser(user: UserDTO): Promise<UserDTO> {
        const values = [
            user.userId ?? null,
            user.uuid ?? null,
            user.userName,
            user.age ?? null,
            user.avatarUrl ?? null,                 // Evita el undefined
            user.avatarBody ? JSON.stringify(user.avatarBody) : null, // Por si es objeto
            user.current ? 1 : 0                    // Booleano a Entero (1 o 0)
        ];

        const response = await this.executeActionSQL(user_table_querys.put.query, values);
        return response && response.length ? response[0] : null;
    }

    async deleteUser(userId: number): Promise<UserDTO[]> {
        return await this.executeActionSQL(user_table_querys.deleteById.query, [userId]);
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
        const response = await this.executeActionSQL(settings_table_querys.selectAll.query);
        return this.normalizeSettings(response);
    }

    async getSettingById(settingId: number): Promise<SettingsDTO> {
        let response = await this.executeActionSQL(settings_table_querys.selectById.query, [settingId]);
        response = this.normalizeSettings(response);
        return response && response.length ? response[0] : null;
    }

    async getSettingCompleteById(settingId: number): Promise<SettingsDTO> {
        let response = await this.executeActionSQL(settings_table_querys.selectByIdWithRelations.query, [settingId]);
        response = this.normalizeSettings(response);
        return response && response.length ? response[0] : null;
    }

    async postSetting(setting: SettingsDTO): Promise<SettingsDTO> {
        setting.permissions = this.objectToString(setting.permissions)
        const response = await this.executeActionSQL(settings_table_querys.post.query, [setting.settingId ?? null, setting.language, setting.permissions, setting.theme]);
        return response && response.length ? response[0] : null;
    }

    async deleteSetting(settingId: number): Promise<SettingsDTO[]> {
        return await this.executeActionSQL(settings_table_querys.deleteById.query, [settingId]);
    }
    //#endregion

    //#region Themes (theme_table)
    async getAllThemes(): Promise<ThemeDTO[]> {
        return await this.executeActionSQL(theme_table_querys.selectAll.query);
    }

    async getTheme(id: string): Promise<ThemeDTO> {
        const response = await this.executeActionSQL(theme_table_querys.selectById.query, [id]);
        return response && response.length ? response[0] : null;
    }

    async postTheme(theme: ThemeDTO): Promise<ThemeDTO> {
        theme.content = this.objectToString(theme.content);
        const response = await this.executeActionSQL(theme_table_querys.post.query, [theme.id, theme.content]);
        return response && response.length ? response[0] : null;
    }

    async deleteTheme(id: string): Promise<ThemeDTO[]> {
        return await this.executeActionSQL(theme_table_querys.deleteById.query, [id]);
    }
    //#endregion

    //#region Quizzes (quiz_table)
    async getAllQuizzes(): Promise<QuizDTO[]> {
        return await this.executeActionSQL(quiz_table_querys.selectAll.query);
    }

    async getQuizById(quizId: number): Promise<QuizDTO> {
        const response = await this.executeActionSQL(quiz_table_querys.selectById.query, [quizId]);
        return response && response.length ? response[0] : null;
    }

    async getQuizCompleteById(quizId: number): Promise<QuizDTO> {
        try {
            const result = await this.executeActionSQL(quiz_table_querys.selectByIdWithRelations.query, [quizId]);

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
        const response = await this.executeActionSQL(quiz_table_querys.post.query, [quiz.uuid, quiz.title, quiz.time, quiz.creationDate, quiz.updatedDate, quiz.startDate]);
        return response && response.length ? response[0] : null;
    }

    private async _putQuiz(quiz: QuizDTO): Promise<QuizDTO> {
        const response = await this.executeActionSQL(quiz_table_querys.put.query, [quiz.quizId ?? null, quiz.uuid, quiz.title, quiz.time, quiz.creationDate, quiz.updatedDate, quiz.startDate]);
        return response && response.length ? response[0] : null;
    }

    async deleteQuiz(quizId: number): Promise<QuizDTO[]> {
        return await this.executeActionSQL(quiz_table_querys.deleteById.query, [quizId]);
    }
    //#endregion

    //#region Answers (answer_table)
    async getAllAnswers(): Promise<AnswerDTO[]> {
        return await this.executeActionSQL(answer_table_querys.selectAll.query);
    }

    async getAnswersByQuiz(quizId: number): Promise<AnswerDTO> {
        const response = await this.executeActionSQL(answer_table_querys.selectById.query, [quizId]);
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
        const response = await this.executeActionSQL(answer_table_querys.post.query, [answer.quizId, answer.title, answer.updatedDate]);
        return response && response.length ? response[0] : null;
    }

    private async _putAnswer(answer: AnswerDTO): Promise<AnswerDTO> {
        const response = await this.executeActionSQL(answer_table_querys.put.query, [answer.answerId ?? null, answer.quizId, answer.title, answer.updatedDate]);
        return response && response.length ? response[0] : null;
    }

    async deleteAnswer(answerId: number): Promise<AnswerDTO[]> {
        const query = ``;
        return await this.executeActionSQL(answer_table_querys.deleteById.query, [answerId]);
    }
    //#endregion

    //#region Answer Options (answer_option_table)
    async getOptionsByAnswer(answerId: number): Promise<AnswerOptionDTO[]> {
        return await this.executeActionSQL(answer_option_table_querys.selectByAnswerId.query, [answerId]);
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
        const response = await this.executeActionSQL(answer_option_table_querys.post.query, [option.answerId, option.content, option.optionIndex, option.updatedDate, correctVal]);
        return response && response.length ? response[0] : null;
    }

    private async _putAnswerOption(option: AnswerOptionDTO): Promise<AnswerOptionDTO> {
        const correctVal = option.isCorrect ? 1 : 0;
        const response = await this.executeActionSQL(answer_option_table_querys.put.query, [option.optionId ?? null, option.answerId, option.content, option.optionIndex, option.updatedDate, correctVal]);
        return response && response.length ? response[0] : null;
    }

    async deleteAnswerOption(optionId: number): Promise<AnswerOptionDTO[]> {
        return await this.executeActionSQL(answer_option_table_querys.deleteById.query, [optionId]);
    }
    //#endregion

    //#region Quiz Attempts (quiz_attempt_table)
    async getAttemptsByUser(userId: number): Promise<AttemptDTO[]> {
        return await this.executeActionSQL(quiz_attempt_table_querys.selectByUserId.query, [userId]);
    }

    async getAttemptById(quizId: number): Promise<AttemptDTO> {
        const response = await this.executeActionSQL(quiz_attempt_table_querys.selectById.query, [quizId]);
        return response && response.length ? response[0] : null;
    }

    async getAttemptByQuizId(quizId: number): Promise<Array<AttemptDTO>> {
        const response = await this.executeActionSQL(quiz_attempt_table_querys.selectByQuizId.query, [quizId]);
        return response && response.length ? response : [];
    }

    async getAttemptWithChildsById(attemptId: number): Promise<AttemptDTO> {
        const response = await this.executeActionSQL(quiz_attempt_table_querys.selectByIdWithRelations.query, [attemptId]);

        if (response && response.length > 0) {
            const data = response[0];
            // Como SQLite devuelve los grupos JSON como cadenas de texto, 
            // los parseamos para que vuelvan a ser arrays/objetos de JavaScript nativos.
            if (typeof data.answers === 'string') {
                data.answers = JSON.parse(data.answers);

                if (data.answers && data.answers.length) {
                    data.answers.map(ans => {
                        if (typeof data.optionsLinked === 'string') {
                            data.optionsLinked = JSON.parse(data.optionsLinked);
                        }
                    });
                }
            }

            if (typeof data.answersLinked === 'string') {
                data.answersLinked = JSON.parse(data.answersLinked);
            }
            return data;
        }
        return null;
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
        const response = await this.executeActionSQL(quiz_attempt_table_querys.post.query, [attempt.quizId, attempt.userId, attempt.title, attempt.updatedDate, attempt.startDate, attempt.score, attempt.state, attempt.time, attempt.answersLinked]);
        return response && response.length ? response[0] : null;
    }

    private async _putQuizAttempt(attempt: AttemptDTO): Promise<AttemptDTO> {
        const response = await this.executeActionSQL(quiz_attempt_table_querys.put.query, [attempt.attemptId ?? null, attempt.quizId, attempt.userId, attempt.title, attempt.updatedDate, attempt.startDate, attempt.score, attempt.state, attempt.time, attempt.answersLinked]);
        return response && response.length ? response[0] : null;
    }

    async deleteQuizAttempt(attemptId: number): Promise<AttemptDTO[]> {
        return await this.executeActionSQL(quiz_attempt_table_querys.deleteById.query, [attemptId]);
    }
    //#endregion

    //#region Answer Attempts (answer_attempt_table)
    async getAnswerAttemptsByAttempt(attemptId: number): Promise<AttemptAnswerDTO[]> {
        return await this.executeActionSQL(answer_attempt_table_querys.selectByAttemptId.query, [attemptId]);
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
        const response = await this.executeActionSQL(answer_attempt_table_querys.post.query, [ansAttempt.attemptId, ansAttempt.answerId, ansAttempt.selectedOptionId, correctVal, ansAttempt.optionsLinked]);
        return response && response.length ? response[0] : null;
    }

    private async _putAnswerAttempt(ansAttempt: AttemptAnswerDTO): Promise<AttemptAnswerDTO> {
        const correctVal = ansAttempt.isCorrect ? 1 : 0;
        const response = await this.executeActionSQL(answer_attempt_table_querys.put.query, [ansAttempt.answerAttemptId ?? null, ansAttempt.attemptId, ansAttempt.answerId, ansAttempt.selectedOptionId, correctVal, ansAttempt.optionsLinked]);
        return response && response.length ? response[0] : null;
    }

    async deleteAnswerAttemptById(attemptId: number): Promise<AttemptDTO[]> {
        return await this.executeActionSQL(answer_attempt_table_querys.deleteById.query, [attemptId]);
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
