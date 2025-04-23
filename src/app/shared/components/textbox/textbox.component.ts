import { Component, ElementRef, ViewEncapsulation, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const fnVoid = () => { };
export const _INPUT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => TextboxComponent),
    multi: true
};

@Component({
    selector: 'textbox',
    templateUrl: './textbox.html',
    styleUrls: ['./textbox.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [_INPUT_VALUE_ACCESSOR],
})
export class TextboxComponent implements OnInit, ControlValueAccessor {
    //#region INPUT/OUTPUT
    @Input() id: string = 'textbox';
    @Input() placeholder: string = 'put yout text here ...';
    @Input() disabled: boolean = false;
    @Input() maxLength: number = -1;
    @Input() tabindex: string = 'auto';
    @Input() autosize: boolean = true;
    //#endregion

    //#region Two binding way variables
    protected _value: any;
    @Input()
    get value() { return this._value; }

    @Output() valueChange = new EventEmitter();
    set value(value) {
        this._value = value;
        this.onChangeCallback(value);
        this.valueChange.emit(this._value);
        this.onChange(null);
        // this.afterChange.emit(new EmitFields(this.id, this.value == null ? false : true, this._value));
    }

    private onTouchedCallback: () => void = fnVoid;
    private onChangeCallback: (_: any) => void = fnVoid;
    //#endregion

    //#region INTERNAL-PROPERTIES
    characterCounter: String = '';
    expand = false;
    //#endregion

    //#region CONSTRUCTOR
    constructor(private _elementRef: ElementRef) {
    }
    //#endregion

    //#region LIFECICLE
    ngOnInit() {
    }

    // #region ControlValueAccessor functions interface
    writeValue(value: any) {
        if (value !== this._value) {
            this._value = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    // #endregion

    //#endregion

    //#region EVENTS

    onChange(evt: any) {
    }
    //#endregion
}
