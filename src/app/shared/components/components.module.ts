import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LogoComponent } from "./logo/logo.component";
import { MatInputComponent } from "./mat-input/mat-input.component";
import { ModalComponent } from "./modal/modal.component";
import { MatAutocompleteComponent } from "./mat-autocomplete/mat-autocomplete.component";

@NgModule ( {
    imports : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        LogoComponent,
        MatInputComponent,
        MatAutocompleteComponent,
        ModalComponent,
    ],
    exports: [
        LogoComponent,
        MatInputComponent,
        MatAutocompleteComponent,
        ModalComponent,
    ]
} )
export class ComponentsModule { }
