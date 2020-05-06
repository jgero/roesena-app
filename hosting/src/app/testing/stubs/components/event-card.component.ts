import { Component, Input } from '@angular/core';
import { AppEvent } from 'src/app/utils/interfaces';

@Component({ selector: 'app-event-card', template: '' })
export class EventCardStubComponent {
  @Input() event: AppEvent;
}
