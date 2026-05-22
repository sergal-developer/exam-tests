import { Injectable } from "@angular/core";
import { WebSqlite } from 'angular-web-sqlite';
import { LanguageDTO, LanguageDTOScript, LogDTO, LogDTOScript, ProfileDTO, ProfileDTOScript, QuizDTO, QuizDTOScript, SettingsDTO, SettingsDTOScript, ThemeDTO, ThemeDTOScript } from "../../data/entities/dtos";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private dbName = 'sinexamdb';
    private initialized = false;
    private isWeb: boolean = false;

    constructor(private webSqlite: WebSqlite) { }

    //#region CONFIG
    async initDataBase(): Promise<void> {
        if (this.initialized) return;

        try {
            // 1. Iniciar el archivo de base de datos en OPFS
            const db = await this.webSqlite.init(this.dbName);
            console.log('db: ', db);
            this.initialized = true;
            console.log('SQLite inicializado correctamente con OPFS.');
        } catch (error) {
            console.error('Error al inicializar SQLite:', error);
            throw error;
        }
    }

    async executeQuery(query: string, parameters: any = {}) {
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
        try {
            const languageDTOScript = LanguageDTOScript;
            const logDTOScript = LogDTOScript;
            const profileDTOScript = ProfileDTOScript;
            const quizDTOScript = QuizDTOScript;
            const settingsScript = SettingsDTOScript;
            const themeScript = ThemeDTOScript;

            const initQueries: [string, any[]][] = [
                [languageDTOScript, []],
                [logDTOScript, []],
                [profileDTOScript, []],
                [quizDTOScript, []],
                [settingsScript, []],
                [themeScript, []]
            ];

            return await this.executeQueryBatch(initQueries);
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

    async getTableQuerys() {
        const db = {
            tables: [],
        };
        db.tables.push({ name: 'language_table', script: LanguageDTOScript, dto: new LanguageDTO() })
        db.tables.push({ name: 'log_table', script: LogDTOScript, dto: new LogDTO() })
        db.tables.push({ name: 'profile_table', script: ProfileDTOScript, dto: new ProfileDTO() })
        db.tables.push({ name: 'quiz_table', script: QuizDTOScript, dto: new QuizDTO() })
        db.tables.push({ name: 'settings_table', script: SettingsDTOScript, dto: new SettingsDTO() })
        db.tables.push({ name: 'theme_table', script: ThemeDTOScript, dto: new ThemeDTO() })
        return db;
    }
    //#endregion CONFIG

    //#region Themes
    async getTheme() {
        await this.initDataBase();
        const query = `SELECT * FROM theme_table`;
        const result = await this.webSqlite.executeSql(query, {});
        console.log('result: ', result);

        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    }

    async setTheme() { }
    async updateTheme() { }
    async deleteTheme() { }
    //#endregion Themes

    //#region Logs
    async getLogs() { }
    async setLog() { }
    async updateLog() { }
    async deleteLog() { }
    //#endregion Logs

    //#region Settings
    async getSettings() { }
    async setSetting() { }
    async updateSetting() { }
    async deleteSetting() { }
    //#endregion Settings

    //#region Profiles
    async getProfiles() { }
    async setProfile() { }
    async updateProfile() { }
    async deleteProfile() { }
    //#endregion Profiles

    //#region Quizs
    async getQuizs() { }
    async setQuiz() { }
    async updateQuiz() { }
    async deleteQuiz() { }
    //#endregion Quizs

    //#region Attemps
    async getAttemps() { }
    async setAttemp() { }
    async updateAttemp() { }
    async deleteAttemp() { }
    //#endregion Attemps

}