import { Component, ElementRef, ViewEncapsulation, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'avatar',
    templateUrl: './avatar.html',
    styleUrls: ['./avatar.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AvatarComponent implements OnInit {
    // #region INPUT/OUTPUT
    @Input() user!: any;
    @Input() class!: any;
    // @Input() time!: number;
    // @Output() afterChange: EventEmitter<any> = new EventEmitter();
    // #endregion

    // #region INTERNAL-VARS
    remainingTime = 0;
    interval: any;
    barProgress = 0;
    barStep = 0;
    barProgressStyle = `width: ${ this.barProgress }%;`;
    isInfinite = false;
    // #endregion

    constructor(public _elementRef: ElementRef) {
    }

    // #region LIFE-CICLE
    ngOnInit() {
        
    }

    // #endregion

    // #region EVENTS
    // #endregion

    // #region CONVERTERS
    // #endregion

    // #region DATA
    // #endregion
}
