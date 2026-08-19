
import {
    QuizAnswerDTO,
    QuizAnswerOptionDTO,
    AttemptAnswerDTO,
    AttemptDTO,
    AttemptState,
    LanguageDTO,
    LogDTO,
    QuizDTO,
    SettingsDTO,
    ThemeDTO,
    UserDTO,
    getLogDTO
} from '../data/entities/dtos';
import { CommonServices } from './common.services';
import { v4 as uuidv4 } from 'uuid';


type Log = (message: string, data?: any) => void;

function createLogger(): Log {
    const calls: string[] = [];
    const log: Log = (message, data) => {
        const line = `${message}${data !== undefined ? ' -> ' + JSON.stringify(data) : ''}`;
        calls.push(line);
        console.log('------------');
        if (data) {
            console.log('[COMMON-TEST]', message, data);
        } else {
            console.log('[COMMON-TEST]', line);
        }
    };
    return log;
}

function toNumberId(value: any): number {
    return typeof value === 'number' ? value : Number(value ?? 0);
}

export class CommonServicesTesting {

    constructor(
        private commonServices: CommonServices
    ) { }

    private log: Log = createLogger();

    //#region SETTINGS
    async testSettings(): Promise<void> {
        const setting: SettingsDTO = {
            settingId: 0,
            language: 'en',
            theme: 'dark',
            permissions: { create: true, duplicate: true, edit: true, delete: true, ai: true } as any
        };
        const saved = await this.commonServices.saveSettings(setting);
        this.log('saveSettings', saved);
        const byId = await this.commonServices.getSettingById(0);
        this.log('getSettingById', byId);
        const current = await this.commonServices.getCurrentSettings();
        this.log('getCurrentSettings', current);
        const updated = await this.commonServices.updateSettings({ ...setting, theme: 'light' });
        this.log('updateSettings', updated);
        const all = await this.commonServices.getAllSettings();
        this.log('getAllSettings.length', all?.length);
        this.log('getAllSettings', all);
    }
    //#endregion SETTINGS

    //#region THEMES
    async testThemes(): Promise<void> {
        const light = this.commonServices.defaultThemeLight;
        const dark = this.commonServices.defaultThemeDark;
        this.log('defaultThemeLight', light?.appBackground);
        this.log('defaultThemeDark', dark?.appBackground);

        const theme: ThemeDTO = { id: 'light', content: this.commonServices.defaultThemeLight as any };
        const saved = await this.commonServices.saveTheme(theme);
        this.log('saveTheme', saved);
        const themes = await this.commonServices.getThemes();
        this.log('getThemes', themes?.length);
    }
    //#endregion THEMES

    //#region USERS
    async testUsers(): Promise<void> {
        const user: UserDTO = {
            uuid: `common-uuid-${Date.now()}`,
            userName: 'Usuario Common',
            age: 25,
            avatarUrl: 'https://example.com/common.png',
            avatarBody: '',
            current: 1
        };
        const saved = await this.commonServices.saveUser(user);
        this.log('saveUser', saved);
        const userId = toNumberId(saved?.userId);
        if (userId) {
            const byId = await this.commonServices.getUserById(userId);
            this.log('getUserById', byId);
            await this.commonServices.deleteUser(userId);
            this.log('deleteUser -> done', userId);
        }
        const current = await this.commonServices.getCurrentUser();
        this.log('getCurrentUser', current);
        const all = await this.commonServices.getAllUsers();
        this.log('getAllUsers', all?.length);
        const active = await this.commonServices.getActiveUser();
        this.log('getActiveUser', active);
    }
    //#endregion USERS

    //#region QUIZ
    private mockQuiz(): QuizDTO {
        return {
            quizId: null,
            uuid: uuidv4(),
            title: 'Examen Common',
            time: 20,
            creationDate: Date.now(),
            updatedDate: Date.now(),
            answers: [
                {
                    answersId: null,
                    title: '¿Pregunta 1?',
                    updatedDate: Date.now(),
                    _options: [
                        { content: 'Opción A', optionIndex: 0, updatedDate: Date.now(), isCorrect: false, _selected: true } as any,
                        { content: 'Opción B', optionIndex: 1, updatedDate: Date.now(), isCorrect: false } as any,
                    ]
                } as any,
                {
                    answersId: null,
                    title: '¿Pregunta 2?',
                    updatedDate: Date.now(),
                    _options: [
                        { content: 'Opción C', optionIndex: 0, updatedDate: Date.now(), isCorrect: false } as any,
                        { content: 'Opción D', optionIndex: 1, updatedDate: Date.now(), isCorrect: false } as any,
                    ]
                } as any,
            ]
        } as any;
    }

    async testPrepareQueryAnswersOptions(): Promise<void> {
        const quiz = this.mockQuiz();
        this.log('original quiz', {
            quiz: quiz
        });

        const prepared = this.commonServices.prepareQueryAnswersOptions(quiz);
        this.log('prepareQueryAnswersOptions', {
            quiz: prepared.quiz.title,
            answers: prepared.answers.length,
            answerOptions: prepared.answerOptions.length
        });
    }

    async testSaveAllQuiz(): Promise<void> {
        const quiz = this.mockQuiz();
        const saved = await this.commonServices.saveAllQuiz(quiz);
        this.log('saveAllQuiz', saved);
        const quizId = toNumberId(saved?.quizId);
        this.log('saveAllQuiz quizId', quizId);

        if (quizId) {
            const byId = await this.commonServices.getQuizById(quizId);
            this.log('getQuizById', byId);
            const complete = await this.commonServices.getQuizCompleteById(quizId);
            this.log('getQuizCompleteById', complete);
            const answers = await this.commonServices.getAllAnswers();
            this.log('getAllAnswers', answers?.length);

            const byQuiz = await this.commonServices.getAnswersByQuiz(quizId);
            this.log('getAnswersByQuiz', byQuiz);

            const answer = complete?.answers?.[0];
            if (answer) {
                const answerId = toNumberId(answer.answerId);
                const options = await this.commonServices.getOptionsByAnswer(answerId);
                this.log('getOptionsByAnswer', options?.length);

                if (options?.[0]) {
                    const option = options[0];
                    const updatedOption = await this.commonServices.saveAnswerOption({
                        ...option,
                        content: 'Opción editada (common)'
                    });
                    this.log('saveAnswerOption (put)', updatedOption);
                    await this.commonServices.deleteAnswerOption(toNumberId(option.optionId));
                    this.log('deleteAnswerOption -> done', option.optionId);
                }

                const updatedAnswer = await this.commonServices.saveAnswer({
                    ...answer,
                    title: 'Pregunta editada (common)'
                });
                this.log('saveAnswer (put)', updatedAnswer);
                await this.commonServices.deleteAnswer(answerId);
                this.log('deleteAnswer -> done', answerId);
            }

            const allQuizs = await this.commonServices.getAllQuizs();
            this.log('getAllQuizs', allQuizs?.length);
        }
    }
    //#endregion QUIZ

    //#region ATTEMPTS
    async testAttempts(): Promise<void> {
        const quiz = this.mockQuiz();
        const savedQuiz = await this.commonServices.saveAllQuiz(quiz);
        const quizId = toNumberId(savedQuiz?.quizId);
        if (!quizId) {
            this.log('testAttempts: quiz not created');
            return;
        }

        const attempt: AttemptDTO = {
            attemptId: null,
            quizId,
            userId: 1,
            title: 'Intento Common',
            time: 20,
            creationDate: Date.now(),
            startDate: Date.now(),
            updatedDate: Date.now(),
            score: 0,
            state: AttemptState.new,
            answersLinked: '[]'
        } as any;
        const savedAttempt = await this.commonServices.saveQuizAttempt(attempt);
        this.log('saveQuizAttempt', savedAttempt);
        const attemptId = toNumberId(savedAttempt?.attemptId);
        this.log('attemptId', attemptId);

        if (attemptId) {
            const byId = await this.commonServices.getAttemptById(attemptId);
            this.log('getAttemptById', byId);
            const byQuiz = await this.commonServices.getAttemptByQuizId(quizId);
            this.log('getAttemptByQuizId', byQuiz?.length);
            const withChilds = await this.commonServices.getAttemptWithChildsById(attemptId);
            this.log('getAttemptWithChildsById', withChilds);

            const answersByAttempt = await this.commonServices.getAnswerAttemptsByAttempt(attemptId);
            this.log('getAnswerAttemptsByAttempt', answersByAttempt?.length);

            await this.commonServices.deleteQuizAttempt(attemptId);
            this.log('deleteQuizAttempt -> done', attemptId);
        }

        await this.commonServices.deleteQuiz(quizId);
        this.log('cleanup quiz -> done', quizId);
    }

    async testSaveAllQuizAttempt(): Promise<void> {
        const quiz = this.mockQuiz();
        const savedQuiz = await this.commonServices.saveAllQuiz(quiz);
        const quizId = toNumberId(savedQuiz?.quizId);
        
        if (!quizId) {
            this.log('testSaveAllQuizAttempt: quiz not created');
            return;
        }

        const attempt: AttemptDTO = {
            attemptId: null,
            quizId: savedQuiz.quizId,
            userId: 1,
            title:  savedQuiz.title,
            updatedDate: Date.now(),
            startDate: Date.now(),
            score: 0,
            state: AttemptState.new,
            time: 0,
            answersLinked: '',
            answers: savedQuiz.answers,
        } as AttemptDTO;

        attempt.answers.map((ans: AttemptAnswerDTO) => {
            return {
                ...ans,
                attemptId: null,
                isCorrect: false,
                title: ans.title,
                updatedDate: Date.now(),
                optionsLinked: JSON.stringify(ans._options)
            }
        });

        console.log('CREATE new attempt: ', attempt);
        debugger;
        const saved = await this.commonServices.saveAllQuizAttempt(attempt);
        
        this.log('saveAllQuizAttempt', saved);
        const attemptId = toNumberId(saved?.attemptId);
        if (attemptId) {
            await this.commonServices.deleteQuizAttempt(attemptId);
            this.log('cleanup attempt -> done', attemptId);
        }
        await this.commonServices.deleteQuiz(quizId);
        this.log('cleanup quiz -> done', quizId);
    }
    //#endregion ATTEMPTS

    //#region LOGS
    async testLogs(): Promise<void> {
        const log = getLogDTO('Log test', 'info');
        console.log('new log: ', log);
        const created = await this.commonServices.postLog(log);
        this.log('postLog', created);
        const id = toNumberId(created?.id);
        if (id) {
            const byId = await this.commonServices.getLogById(id);
            this.log('getLogById', byId);
            await this.commonServices.deleteLog(id);
            this.log('deleteLog -> done', id);
        }
        const all = await this.commonServices.getAllLogs();
        this.log('getAllLogs', all?.length);
    }
    //#endregion LOGS

    //#region STRUCTURE
    async testStructure(): Promise<void> {
        const structure = await this.commonServices.getStructure();
        const tables = Array.isArray(structure) ? structure.map((s: any) => s.name).filter(Boolean) : structure;
        this.log('getStructure', tables);
    }

    async testSetDefaultData(): Promise<void> {
        const settings = await this.commonServices.setDefaultData();
        this.log('setDefaultData', settings?.settingId);
    }
    //#endregion STRUCTURE

    //#region NAVIGATION
    async testNavigate(): Promise<void> {
        this.commonServices.navigate('dashboard');
        this.commonServices.navigate('quiz', 'edit', '42', { title: 'Mi examen' });
        this.commonServices.navigate('settings', 'theme');
        this.log('navigate -> done');
    }
    //#endregion NAVIGATION

    async runAll(): Promise<void> {
        this.log('=== BEGIN COMMON SERVICES TEST ===');
        // await this.testStructure();
        // await this.testThemes();
        // await this.testSettings();
        // await this.testSetDefaultData();
        // await this.testUsers();
        // await this.testPrepareQueryAnswersOptions();
        // await this.testSaveAllQuiz();
        await this.testLogs();
        // await this.testAttempts();
        // await this.testSaveAllQuizAttempt();
        // await this.testNavigate();
        this.log('=== END COMMON SERVICES TEST ===');
    }
}

export async function runCommonServicesTests(commonServices: CommonServices): Promise<void> {
    const runner = new CommonServicesTesting(commonServices);
    await runner.runAll();
}