import { Services } from './services';
import { Storage } from './storage';

// let $: any;

export class DashboardApp {
    storage = new Storage('exam');
    sections = {
        modal: null,
        userDetails: null,
    }
    profile: any;

    constructor() { }
    init() {
        this.profile = this.storage.get('profile');
        // this.profile = this.storage.get('profile');
        // this.sections.userDetails = document.querySelector('#userDetails');

        // if (!this.profile) {
        //     this.sections.modal = $('.ui.modal');
        //     this.sections.modal.modal('setting', 'closable', false)
        //         .modal('show');
        // } else {
        //     this.sections.userDetails.style.cssText = 'display: inline-block;'
        // }
    }

    createUser() {
        const inputUserName: any = document.querySelector('#username');
        let username = inputUserName.value.trim();
        console.log('createUser', inputUserName.value.trim());
        if(username) {
            this.sections.modal.modal('hide');
            this.storage.save({ username: username, topics: { list: [], total: 0} }, 'profile');
            this.init();
        }
    }
}





