import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHoverable]'
})
export class HoverableDirective implements OnInit {

  @Input()
  private hoverColor = 'primary';

  constructor(private element: ElementRef) { }

  ngOnInit() {
    (this.element.nativeElement as HTMLElement).classList.add('hoverable', this.hoverColor);
  }

}
