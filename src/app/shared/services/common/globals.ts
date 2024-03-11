import { Injectable } from "@angular/core";

@Injectable()
export class GlobalConstants {
    public userProfile: any;

    public dataMatters: any;
    public wordsCollection: Array<String> = [];

    public resetGlobals() {
        /************************
            * NOTE:
            add here the variables that need to be restored at the end of the session
        **************************/

        this.userProfile = null;
        this.dataMatters = null;
        this.wordsCollection = [];
    }
}
