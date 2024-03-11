export class Quiz {
    term: string;
    result!: string;
    timeLimit!: number;
    remainingTime!: number;
    options!: Array<QuizOption>;

    constructor(term: string, options?: any) {
        this.term = term;

        if (options) {
            const keys = Object.keys(options);
            keys.forEach(k => {
                const newLocal: any = this;
                newLocal[k] = options[k];
            });
        }
    }
}
export interface QuizInterface {
    term?: string;
    result?: string;
    timeLimit?: number;
    remainingTime?: number;
    options?: Array<QuizOption>;
}

export class QuizOption {
    value: any;
    isSelected!: boolean;
    isCorrectAnswer!: boolean;

    constructor(value: any) {
        this.value = value;
    }
}
