// import { Services } from './services';
import { Storage } from './storage';
import { Utils } from './utils';

// let $: any;

export class APP {
    storage = new Storage('exam');
    utils = new Utils();

    constructor() { }
    init() {
        let val = this.storage.get('profile');

        if (!val) {
            this.utils.redirect('/exam-tests/profile');
        } else {
            this.utils.redirect('/exam-tests/dashboard');
        }

        // this.services.getRawData((data) => {
        //     // console.log('data: ', data);
        // })


        // const modalRef: any = $('.ui.modal');
        // modalRef.modal('setting', 'closable', false)
        //     .modal('show');
    }
}





