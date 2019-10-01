import { Component, Input, HostBinding } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [
        style({ top: 0, opacity: 0 }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ top: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class InfoPopupComponent {

  @Input()
  message: string;

  constructor() { }

  @HostBinding('@fadeInOut')
  state = true;
}
