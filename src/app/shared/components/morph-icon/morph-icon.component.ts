import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'm-icon',
  templateUrl: './morph-icon.html',
  styleUrls: ['./morph-icon.scss']
})
export class IconComponent implements OnChanges {
  @ViewChild('icon', { static: true }) iconRef!: ElementRef<HTMLElement>;

  @Input() icon = 'M4 6h16M4 12h16M4 18h16';   // default / "closed" state
  @Input() altIcon = 'M18 6L6 18M6 6l12 12';    // "open" state
  @Input() open = false;
  @Input() label = 'Menu';
  @Input() size = 24;
  @Input() color = 'currentColor';
  @Input() strokeWidth = 2;
  @Input() spring = 'snappy';
  @Input() reducedMotion: 'never' | 'user' | 'always' = 'never';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      (this.iconRef.nativeElement as any).morphTo(this.open ? this.altIcon : this.icon, this.spring);
    }
  }

  toggle() {
    this.open = !this.open;
    (this.iconRef.nativeElement as any).morphTo(this.open ? this.altIcon : this.icon, this.spring);
  }
}
