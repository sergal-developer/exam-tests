import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TimerComponent } from "./timer.component";

@NgModule ( {
    imports : [
        CommonModule,
        FormsModule
    ],
    declarations: [
        TimerComponent
    ],
    exports: [
        TimerComponent
    ],
    providers: []
} )
export class TimerModule { }