import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

export const cardFlyIn = trigger('cardFlyIn', [
  transition('void => *', [
    query(
      ':enter',
      [
        style({ transform: 'translateY(-50%)', opacity: 0 }),
        stagger(90, [animate('0.2s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))]),
      ],
      { optional: true }
    ),
  ]),
]);
