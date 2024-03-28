import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AvatarModule } from "./avatar/avatar.module";
import { ModalModule } from "./modal/modal.module";

@NgModule ( {
    imports : [
        CommonModule,
        AvatarModule,
        ModalModule
    ],
    declarations: [],
    exports: [
        AvatarModule,
        ModalModule
    ],
    providers: []
} )
export class ComponentsModule { }