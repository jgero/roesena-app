import { Component } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss'],
  animations: [
    trigger('barAnimation', [
      transition('void => *', [
        query(
          ':self',
          [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('0.2s', style({ transform: 'translateX(0)', opacity: 1 }))
          ],
          {
            optional: true
          }
        )
      ])
    ])
  ]
})
export class EditingComponent {}
