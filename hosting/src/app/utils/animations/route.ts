import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
    group([
      query(
        ':enter',
        [style({ transform: 'translateX(100%)' }), animate('0.2s ease-out', style({ transform: 'translateX(0)' }))],
        { optional: true }
      ),
      query(
        ':leave',
        [style({ transform: 'translateX(0%)' }), animate('0.2s ease-out', style({ transform: 'translateX(-100%)' }))],
        { optional: true }
      ),
    ]),
  ]),
]);
