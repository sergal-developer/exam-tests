import { QuestionEntity, TypeOperation } from "./matters.entity";

export class QuestionHourEntity extends QuestionEntity {
    listResults: Array<any> = [];

    constructor(id: number, term: string, options?: any) {
        super(id, TypeOperation.hour, term);

        if (options) {
            const keys = Object.keys(options);
            keys.forEach(k => {
                const newLocal: any = this;
                newLocal[k] = options[k];
            });
        }
    }
}