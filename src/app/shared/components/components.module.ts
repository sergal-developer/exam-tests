import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LogoComponent } from "./logo/logo.component";
import { MatAutocompleteComponent } from "./mat-autocomplete/mat-autocomplete.component";
import { MatInputComponent } from "./mat-input/mat-input.component";
import { ModalComponent } from "./modal/modal.component";
import { IconComponent } from "./morph-icon/morph-icon.component";

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
        IconComponent
    ],
    exports: [
        LogoComponent,
        MatInputComponent,
        MatAutocompleteComponent,
        ModalComponent,
        IconComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
} )
export class ComponentsModule { }
