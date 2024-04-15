export class Helpers {

    constructor() { }


    dynamicSort(property: string) {
        let sortOrder = 1;
        if (property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
        }
        return (a: any, b: any) => {
            const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    }

    shuffleArray(array: Array<any>) {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }


    formatText(text?: string) {
        let res = '';
        if (text) {
            res = text.replace(/\n/g, '<br>').replace(/\r/g, '<br>');
        }
        return res;
    }
}
