import { QuestionEntity, TypeOperation } from "./matters.entity";

export class QuestionWordEntity extends QuestionEntity {
    image: string = '';
    writtenWord: Array<any> = [];
    wordArray: Array<string> = [];
    listLetters: Array<any> = [];

    constructor(id: number, term: string, options?: any) {
        super(id, TypeOperation.word, term);

        if (options) {
            const keys = Object.keys(options);
            keys.forEach(k => {
                const newLocal: any = this;
                newLocal[k] = options[k];
            });
        }
    }
}