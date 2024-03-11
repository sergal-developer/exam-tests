import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AvatarComponent } from "./avatar.component";

@NgModule ( {
    imports : [
        CommonModule,
        FormsModule
    ],
    declarations: [
        AvatarComponent
    ],
    exports: [
        AvatarComponent
    ],
    providers: []
} )
export class AvatarModule { }