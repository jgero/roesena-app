import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/services/auth.guard';

import { StartpageComponent } from './startpage/startpage.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HelpComponent } from './help/help.component';
import { ImagePageComponent } from './image-page/image-page.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';

const routes: Routes = [
  { path: '', component: StartpageComponent, data: { animation: 'StartPage' } },
  { path: 'calendar', component: CalendarComponent, data: { animation: 'CalendarPage' } },
  { path: 'events', component: EventsComponent, data: { animation: 'EventsPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { animation: 'ProfilePage' } },
  {
    path: 'edit', canActivate: [AuthGuard], data: { animation: 'SettingsPage' },
    loadChildren: () => import('../editing/editing.module').then(m => m.EditingModule)
  },
  { path: 'help', component: HelpComponent, data: { animation: 'HelpPage' } },
  { path: 'images', component: ImagePageComponent, data: { animation: 'ImagePage' } },
  { path: '**', component: ErrorpageComponent, data: { animation: 'ErrorPage' } }
];

export const PublicRouting = RouterModule.forRoot(routes);
