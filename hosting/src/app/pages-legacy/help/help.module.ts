import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { EventsComponent } from './events/events.component';
import { ImagesComponent } from './images/images.component';
import { ArticlesComponent } from './articles/articles.component';
import { AuthComponent } from './auth/auth.component';
import { CalendarComponent } from './calendar/calendar.component';
import { GeneralComponent } from './general/general.component';
import { RootComponent } from './root/root.component';


@NgModule({
  declarations: [EventsComponent, ImagesComponent, ArticlesComponent, AuthComponent, CalendarComponent, GeneralComponent, RootComponent],
  imports: [
    CommonModule,
    HelpRoutingModule
  ]
})
export class HelpModule { }
