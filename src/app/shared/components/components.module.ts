import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AvatarModule } from "./avatar/avatar.module";
import { LogoComponent } from "./logo/logo.component";
import { MatInputComponent } from "./mat-input/mat-input.component";
import { ModalModule } from "./modal/modal.module";
import { TextboxModule } from "./textbox/textbox.module";
import { TimerModule } from "./timer/timer.module";

@NgModule ( {
    imports : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        AvatarModule,
        ModalModule,
        TextboxModule,
        TimerModule
    ],
    declarations: [
        LogoComponent,
        MatInputComponent
    ],
    exports: [
        LogoComponent,
        MatInputComponent,
        AvatarModule,
        ModalModule,
        TextboxModule,
        TimerModule,
    ],
    providers: []
} )
export class ComponentsModule { }
