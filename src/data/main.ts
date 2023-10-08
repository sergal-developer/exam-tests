import { Storage } from './storage';
export class APP {

    storage = new Storage('exam');

    constructor() { }
    init() {
        //this.setupIntro();
        // this.setupEvents();

        let val = this.storage.get();
        console.log('val: ', val);

        if(!val) {
            this.storage.save({ user: 'test', role: 'test'});
            val = this.storage.get();
        console.log('val: ', val);
        }

    }
}





