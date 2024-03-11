import { QuestionEntity, TypeOperation } from "./matters.entity";
import { QuestionOptionEntity } from "./QuestionOptionEntity";

export class QuestionMathEntity extends QuestionEntity {
    termOperators: Array<any> = [];
    listResults: Array<QuestionOptionEntity> = [];

    constructor(id: number, type: TypeOperation, term: string, options?: any) {
        super(id, type, term);

        if (options) {
            const keys = Object.keys(options);
            keys.forEach(k => {
                const newLocal: any = this;
                newLocal[k] = options[k];
            });
        }
    }
}