import { EmptyComponent } from './stubs';
import { Route } from '@angular/router';

export const testingRoutes: Route[] = [
  { path: '', component: EmptyComponent },
  { path: 'events', component: EmptyComponent },
  { path: 'auth', component: EmptyComponent, children: [{ path: 'login', component: EmptyComponent }] },
  {
    path: 'articles',
    component: EmptyComponent,
    children: [{ path: 'overview', component: EmptyComponent }],
  },
  { path: 'images', component: EmptyComponent },
  { path: 'calendar', component: EmptyComponent },
  { path: 'groups', component: EmptyComponent },
  { path: 'about', component: EmptyComponent },
  { path: '**', component: EmptyComponent },
];
