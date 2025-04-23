import { Component, ElementRef, ViewEncapsulation, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'timer',
    templateUrl: './timer.html',
    styleUrls: ['./timer.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TimerComponent implements OnInit {
    //#region INPUT/OUTPUT
    @Input() minutes: any = 0;
    @Input() interval: any = null;

    protected _autostart: boolean = false;
    @Input()
    get autostart() { 
      console.log('autostart: ', this._autostart);
      return this._autostart; }

    @Output() autostartChange = new EventEmitter();
    set autostart(autostart) {
      console.log('autostart: ', autostart);
        this._autostart = autostart;
        this.autostartChange.emit(this._autostart);
        this.startTimers();
    }
    //#endregion

    //#region INTERNAL-PROPERTIES
    timeEnlapsed = 0;
    timerFormated = '';
    //#endregion

    //#region CONSTRUCTOR
    constructor(private _elementRef: ElementRef) {
    }
    //#endregion

    //#region LIFECICLE
    ngOnInit() {
      console.log('this.minutes: ', this.minutes);
    }

    // #endregion

    //#endregion

    //#region EVENTS
    startTimers() {
        const minutes = 1000 * 60 * this.minutes;
        console.log('minutes: ', minutes);
        this.timeEnlapsed = 0;

        if(!this.autostart) {
          if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
          } else {
            this.timerFormated = `${ this.minutes } min.`;
          }
          return;
        }
  
        this.interval = setInterval(() => {
          if(this.minutes) {
            if (this.timeEnlapsed >= minutes) {
              this.timerFormated = 'Finished.'
              clearInterval(this.interval);
              this.interval = null;
              return;
            }
          }
          
          this.timeEnlapsed = this.timeEnlapsed + 1000;
    
          let  miliseconds = 0;
    
          if(this.minutes) {
            miliseconds = minutes - this.timeEnlapsed;
          } else {
            miliseconds = this.timeEnlapsed;
          }
          
          let _minutes = Math.floor(miliseconds / 60000);
          let _seconds = ((miliseconds % 60000) / 1000);
          this.timerFormated = `${_minutes < 10 ? '0' + _minutes : _minutes}:${_seconds < 10 ? '0' + _seconds.toFixed(0) : _seconds}`;
        }, 1000);
      }
    //#endregion
}
