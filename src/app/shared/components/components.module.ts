import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AvatarModule } from "./avatar/avatar.module";
import { LogoComponent } from "./logo/logo.component";
import { MatInputComponent } from "./mat-input/mat-input.component";
import { TimerModule } from "./timer/timer.module";
import { ModalComponent } from "./modal/modal.component";

@NgModule ( {
    imports : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        AvatarModule,
        TimerModule
    ],
    declarations: [
        LogoComponent,
        MatInputComponent,
        ModalComponent,
    ],
    exports: [
        LogoComponent,
        MatInputComponent,
        ModalComponent,
        AvatarModule,
        TimerModule,
    ],
    providers: []
} )
export class ComponentsModule { }
