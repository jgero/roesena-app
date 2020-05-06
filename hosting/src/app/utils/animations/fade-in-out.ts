import { style, trigger, transition, animate } from '@angular/animations';

export const fadeInOut = trigger('inout', [
  transition(':enter', [style({ opacity: 0 }), animate('0.2s ease-out', style({ opacity: 0.8 }))]),
  transition(':leave', [style({ opacity: 0.8 }), animate('0.2s ease-out', style({ opacity: 0 }))]),
]);
