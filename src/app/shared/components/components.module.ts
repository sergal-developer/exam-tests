import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AvatarModule } from "./avatar/avatar.module";
import { ModalModule } from "./modal/modal.module";
import { TextboxModule } from "./textbox/textbox.module";
import { TimerModule } from "./timer/timer.module";

@NgModule ( {
    imports : [
        CommonModule,
        AvatarModule,
        ModalModule,
        TextboxModule,
        TimerModule
    ],
    declarations: [],
    exports: [
        AvatarModule,
        ModalModule,
        TextboxModule,
        TimerModule
    ],
    providers: []
} )
export class ComponentsModule { }
