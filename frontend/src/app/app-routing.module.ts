import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartpageComponent } from './startpage/startpage.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { ProfileComponent } from './profile/profile.component';
import { HelpComponent } from './help/help.component';
import { AuthGuard } from './auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { PersonSettingsComponent } from './settings/person-settings/person-settings.component';
import { EventSettingsComponent } from './settings/event-settings/event-settings.component';
import { ArticleSettingsComponent } from './settings/article-settings/article-settings.component';
import { ImageSettingsComponent } from './settings/image-settings/image-settings.component';


const routes: Routes = [
  { path: '', component: StartpageComponent, data: { animation: 'StartPage' } },
  { path: 'calendar', component: CalendarComponent, data: { animation: 'CalendarPage' } },
  { path: 'events', component: EventsComponent, data: { animation: 'EventsPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { animation: 'ProfilePage' } },
  {
    path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], data: { animation: 'SettingsPage' }, children: [
      { path: 'persons', component: PersonSettingsComponent },
      { path: 'events', component: EventSettingsComponent },
      { path: 'articles', component: ArticleSettingsComponent },
      { path: 'images', component: ImageSettingsComponent },
      { path: '**', redirectTo: 'persons', pathMatch: 'full' }
    ]
  },
  { path: 'help', component: HelpComponent, data: { animation: 'HelpPage' } },
  { path: '**', component: ErrorpageComponent, data: { animation: 'ErrorPage' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
