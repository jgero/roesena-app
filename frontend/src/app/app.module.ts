import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
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
import { NavBarComponent } from './main/nav-bar/nav-bar.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './main/footer/footer.component';
import { NavBarNavigatorsComponent } from './main/nav-bar/nav-bar-navigators/nav-bar-navigators.component';
import { NavBarMiscComponent } from './main/nav-bar/nav-bar-misc/nav-bar-misc.component';

@NgModule({
  declarations: [
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
    HelpComponent,
    NavBarComponent,
    FooterComponent,
    MainComponent,
    NavBarNavigatorsComponent,
    NavBarMiscComponent
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
  bootstrap: [MainComponent]
})
export class AppModule { }
