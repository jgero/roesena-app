import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartpageComponent } from './startpage/startpage.component';
import { ArticleComponent } from './startpage/article/article.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TitleComponent } from './startpage/title/title.component';
import { DayDetailsComponent } from './calendar/day-details/day-details.component';
import { MonthNamePipe } from './calendar/month-name.pipe';
import { ProfileComponent } from './profile/profile.component';
import { HelpComponent } from './help/help.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    StartpageComponent,
    ArticleComponent,
    ErrorpageComponent,
    EventsComponent,
    LoginComponent,
    CalendarComponent,
    TitleComponent,
    DayDetailsComponent,
    MonthNamePipe,
    ProfileComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
