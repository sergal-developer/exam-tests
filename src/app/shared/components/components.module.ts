import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LogoComponent } from "./logo/logo.component";
import { MatAutocompleteComponent } from "./mat-autocomplete/mat-autocomplete.component";
import { MatInputComponent } from "./mat-input/mat-input.component";
import { ModalComponent } from "./modal/modal.component";
import { MorphIconComponent } from "./morph-icon/morph-icon.component";
import { LucideIconComponent } from "./lucide-icon/lucide-icon.component";

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
        MorphIconComponent,
        LucideIconComponent
    ],
    exports: [
        LogoComponent,
        MatInputComponent,
        MatAutocompleteComponent,
        ModalComponent,
        MorphIconComponent,
        LucideIconComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
} )
export class ComponentsModule { }
