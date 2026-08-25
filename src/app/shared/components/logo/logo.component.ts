import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { icons } from "lucide";
import { MorphIconComponent } from '../morph-icon/morph-icon.component';

@Component({
    selector: 'logo',
    templateUrl: './logo.html',
    styleUrls: ['./logo.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LogoComponent implements AfterViewInit {
    // #region INPUT/OUTPUT
    @Input() class: string = '';
    // #endregion

    //#region PROOPERTIES
    isMenuOpen = false;
    listIcons = [
        icons.GraduationCap,
        icons.BookOpenText,
        icons.Book,
        icons.Notebook,
        icons.Omega
    ]

    _icon = {
        start: icons.GraduationCap,
        end: icons.Omega,
    }

    ico = {
        start: icons.Cpu,
        end: icons.Sparkles
    }
    //#endregion PROPERTIES

    constructor() {
    }

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        // setTimeout(() => {
        //     this.morphIcon?.change();
        // }, 2000);
    }
}
