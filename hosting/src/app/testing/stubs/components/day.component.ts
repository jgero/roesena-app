import { Component, Input } from '@angular/core';

@Component({ selector: 'app-day', template: '' })
export class DayStubComponent {
  @Input() events: any;
  @Input() day: any;
}
