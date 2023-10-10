import { Storage } from './storage';
import { Utils } from './utils';

export class ProfileApp {
    utils = new Utils();
    storage = new Storage('exam');
    sections = {
        modal: null,
        userDetails: null,
    }
    profile: any;

    constructor() { }
    init() {
        this.profile = this.storage.get('profile');
        this.sections.userDetails = document.querySelector('#userDetails');

        if (!this.profile) {
            this.sections.modal = $('.ui.modal');
            this.sections.modal.modal('setting', 'closable', false)
                .modal('show');
        } else {
            this.sections.userDetails.style.cssText = 'display: inline-block;'
        }
    }

    createUser() {
        const inputUserName: any = document.querySelector('#username');
        let username = inputUserName.value.trim();

        if(username) {
            this.sections.modal.modal('hide');
            this.storage.save({ username: username, topics: { list: [], total: 0} }, 'profile');
            this.utils.redirect('/exam-tests/');
        } else {
            const input = document.querySelector('.ui.input');
            input.classList.add('error');
        }
    }

    getProfileDetails() {
        this.profile = this.storage.get('profile');

        this.utils.assignDataInner(this.profile.username, '#usernameTitle');
        return this.profile;
    }
}




