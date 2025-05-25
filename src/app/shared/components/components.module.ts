import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LogoComponent } from "./logo/logo.component";
import { MatInputComponent } from "./mat-input/mat-input.component";
import { ModalComponent } from "./modal/modal.component";

@NgModule ( {
    imports : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
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
    ]
} )
export class ComponentsModule { }
