import { Injectable } from "@angular/core";
import { Helpers } from "src/app/shared/services/common/helpers";

@Injectable()
export class MainServices {

    _helper = new Helpers();

    activeTimer: any;
    public _notification: any = {
        type: 'info',
        closeTimer: 3000,
        text: '',
        show: false,
        icon: ''
    };

    constructor() {
    }
    //#region NOTIFICATIONS
    public notification(text: string, options?: { type?: string, closeTimer?: number }) {

        // Reset notification
        this._notification = {
            type: 'info',
            closeTimer: 3000,
            text: '',
            show: false,
            icon: ''
        };

        this._notification.text = this._helper.formatText(text);
        if (options) {
            this._notification.type = options?.type || 'info';
            this._notification.closeTimer = options?.closeTimer != undefined ? options?.closeTimer : 3000;
        }
        this._notification.show = true;
        this.onCloseTimer();
    }

    onCloseTimer() {
        if ((this._notification.closeTimer && this._notification.closeTimer > 0) && this._notification.show) {
            this.activeTimer = setTimeout(() => {
                this._notification.show = false;
            }, this._notification.closeTimer);
        } else {
            clearTimeout(this.activeTimer);
            this.activeTimer = null;
        }
    }

    closeNotification() {
        if (this.activeTimer) {
            clearTimeout(this.activeTimer);
            this.activeTimer = null;
        }
        this._notification.show = false;
    }

    //#endregion

}

