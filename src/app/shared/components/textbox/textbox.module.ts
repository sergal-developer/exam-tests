import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextboxComponent } from "./textbox.component";

@NgModule ( {
    imports : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        TextboxComponent
    ],
    exports: [
        TextboxComponent
    ],
    providers: []
} )
export class TextboxModule { }