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
import { SearchComponent } from './shared/components/search/search.component';
import { TitleComponent } from './startpage/title/title.component';
import { DayDetailsComponent } from './calendar/day-details/day-details.component';
import { MonthNamePipe } from './calendar/month-name.pipe';
import { ProfileComponent } from './profile/profile.component';
import { HelpComponent } from './help/help.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SettingsComponent } from './settings/settings.component';
import { ArticleSettingsComponent } from './settings/article-settings/article-settings.component';
import { EventSettingsComponent } from './settings/event-settings/event-settings.component';
import { PersonSettingsComponent } from './settings/person-settings/person-settings.component';
import { ImageManagerComponent } from './settings/article-settings/image-manager/image-manager.component';
import { SafeURLPipe } from './shared/safe-url.pipe';
import { ImageSettingsComponent } from './settings/image-settings/image-settings.component';
import { ImageCardComponent } from './settings/image-settings/image-card/image-card.component';
import { EditCardComponent } from './settings/image-settings/edit-card/edit-card.component';
import { TagComponent } from './shared/components/tag/tag.component';

@NgModule({
  declarations: [
    AppComponent,
    StartpageComponent,
    ArticleComponent,
    ErrorpageComponent,
    EventsComponent,
    LoginComponent,
    CalendarComponent,
    SearchComponent,
    TitleComponent,
    DayDetailsComponent,
    MonthNamePipe,
    ProfileComponent,
    HelpComponent,
    FooterComponent,
    SettingsComponent,
    ArticleSettingsComponent,
    EventSettingsComponent,
    PersonSettingsComponent,
    ImageManagerComponent,
    SafeURLPipe,
    ImageSettingsComponent,
    ImageCardComponent,
    EditCardComponent,
    TagComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
