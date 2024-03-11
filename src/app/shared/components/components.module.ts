import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AvatarModule } from "./avatar/avatar.module";

@NgModule ( {
    imports : [
        CommonModule,
        AvatarModule,
    ],
    declarations: [],
    exports: [
        AvatarModule,
    ],
    providers: []
} )
export class ComponentsModule { }