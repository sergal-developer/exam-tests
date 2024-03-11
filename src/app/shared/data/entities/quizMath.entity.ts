import { Quiz, QuizOption } from "./quiz.entity";

export class QuizMath extends Quiz {
    type: string = '';
    operators!: Array<any>;

    constructor(term: string, options?: QuizMathInterface) {
        super(term);

        this.result = eval(this.term);
        this.options = this.createOptions(6, this.result);
        this.operators = this.getOperators(this.term);

        if (options) {
            this.remainingTime = options.remainingTime || -1;
        }
    }

    getOperators(term: string) {
        let result: Array<any> = [];
        const numbers = term.split(' ');
        numbers.forEach(element => {
            const isNumeric = this._isNumeric(element);
            if (!isNumeric) {
                element = element.replace('*', 'x');
            }

            result.push({ value: element, isOperator: !isNumeric })
        });
        return result;
    }

    createOptions(items = 4, result: any, min = 1) {
        let optionsResults: Array<QuizOption> = [ new QuizOption(result) ];
        const max = result + items;

        for (let i = 0; i < items - 1; i++) {
            const wrongNumber = this._generateRandomIntegerInRange(min, max, result);
            optionsResults.push( new QuizOption(wrongNumber) );
        }

        // optionsResults = optionsResults.sort(() => Math.random() - 1)
        optionsResults = this._shuffleArray(optionsResults);

        return optionsResults;
    }

    _generateRandomIntegerInRange(min: number, max: number, noRepeat?: number) {
        let result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (noRepeat && result === noRepeat) {
            result = this._generateRandomIntegerInRange(min, max, noRepeat);
        }
        return result;
    }

    _shuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    _isNumeric(value: any) {
        return /^-?\d+$/.test(value);
    }
}
export interface QuizMathInterface {
    term?: string;
    result?: string;
    timeLimit?: number;
    remainingTime?: number;
    options?: Array<QuizOption>;
    operators?: Array<any>;
}
