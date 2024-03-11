export class QuestionOptionEntity {
    value: any;
    isSelected: boolean = false;

    isCorrectAnswer!: boolean;
    isOperator!: boolean;

    constructor(value: any, options?: any) {
        this.value = value;

        if (options) {
            const keys = Object.keys(options);
            keys.forEach(k => {
                const newLocal: any = this;
                newLocal[k] = options[k];
            });
        }
    }
}