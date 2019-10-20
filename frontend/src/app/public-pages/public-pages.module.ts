import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PopupModule } from '../popup/popup.module';
import { GraphQLModule } from '../GraphQL/graphql.module';
import { PublicRouting } from './public-pages-routing.module';

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
import { NavBarComponent } from './main/nav-bar/nav-bar.component';
import { FooterComponent } from './main/footer/footer.component';
import { MainComponent } from './main/main.component';
import { NavBarNavigatorsComponent } from './main/nav-bar/nav-bar-navigators/nav-bar-navigators.component';
import { NavBarMiscComponent } from './main/nav-bar/nav-bar-misc/nav-bar-misc.component';
import { ImagePageComponent } from './image-page/image-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MainComponent,
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
    NavBarMiscComponent,
    ImagePageComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    PublicRouting,
    PopupModule,
    GraphQLModule,
    SharedModule
  ],
  exports: [
    MainComponent
  ]
})
export class PublicPagesModule { }
