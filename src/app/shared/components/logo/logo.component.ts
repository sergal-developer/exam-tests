import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'logo',
    templateUrl: './logo.html',
    styleUrls: ['./logo.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LogoComponent {
    // #region INPUT/OUTPUT
    @Input() class: string = '';
    // #endregion

    constructor() {
    }
}
