export class EmitResponse {
    id: any;
    value: any;
    rawValue: any;

    constructor(id: any, value: any, rawValue?: any, options?: any) {
        this.id = id;
        this.value = value;
        this.rawValue = rawValue || null;

        if (options) {
            const keys = Object.keys(options);
            keys.forEach(k => {
                const newLocal: any = this;
                newLocal[k] = options[k];
            });
        }
    }
}

