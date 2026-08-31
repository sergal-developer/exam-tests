import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'section-dinamic',
    template: `
    <div
      #container
      class="dynamic-expand {{ design }}"
      [style.height.px]="height" >
      <div #content class="dynamic-expand__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
    styleUrls: ['./section-dinamic.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SectionDinamicComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input()
    isOpen = true;

    @Input()
    design: 'acrilic' | 'glass' | 'gold' = 'acrilic';

    @Input()
    minHeight = 150;

    @ViewChild('content', { static: true })
    content!: ElementRef<HTMLElement>;

    height = 0;

    private resizeObserver?: ResizeObserver;

    constructor(
        private ngZone: NgZone,
        private elementRef: ElementRef<HTMLElement>
    ) { }

    ngAfterViewInit(): void {
        const element =
            this.elementRef.nativeElement;
        element.style.setProperty(
            '--controlMinHeight-x',
            `${this.minHeight}px`
        );

        this.height = this.minHeight;
        console.log('this.height: ', this.height);
        this.createResizeObserver();

        // Esperamos a que Angular termine de renderizar
        setTimeout(() => {
            this.updateHeight();
        });
    }

    /**
     * Detecta cambios en los @Input()
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['minHeight']) {
            this.updateHeight();
        }
    }

    /**
     * Observa cualquier cambio físico de tamaño
     * del contenido interno.
     */
    private createResizeObserver(): void {

        this.ngZone.runOutsideAngular(() => {

            this.resizeObserver = new ResizeObserver(() => {

                this.ngZone.run(() => {
                    this.updateHeight();
                });

            });

            this.resizeObserver.observe(
                this.content.nativeElement
            );
        });
    }

    /**
     * Calcula nuevamente la altura.
     */
    private updateHeight(): void {
        // this.height = this.minHeight;
        const element = this.content.nativeElement;
        this.height = element.scrollHeight;
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {

        const element =
            this.elementRef.nativeElement;

        const rect =
            element.getBoundingClientRect();

        const x =
            ((event.clientX - rect.left) / rect.width) * 100;

        const y =
            ((event.clientY - rect.top) / rect.height) * 100;

        element.style.setProperty(
            '--mouse-x',
            `${x}%`
        );

        element.style.setProperty(
            '--mouse-y',
            `${y}%`
        );
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        const element =
            this.elementRef.nativeElement;
        
        element.style.setProperty(
            '--mouse-x',
            '50%'
        );

        element.style.setProperty(
            '--mouse-y',
            '50%'
        );
    }
}
