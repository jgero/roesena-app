import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireFunctionsModule } from "@angular/fire/functions";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { StartPageComponent } from "./pages/start-page/start-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { EventsPageComponent } from "./pages/events-page/events-page.component";
import { EventEditorComponent } from "./pages/events-page/event-editor/event-editor.component";
import { CalendarPageComponent } from "./pages/calendar-page/calendar-page.component";
import { AuthPageComponent } from "./pages/auth-page/auth-page.component";
import { LoginComponent } from "./pages/auth-page/login/login.component";
import { RegisterComponent } from "./pages/auth-page/register/register.component";
import { ChangeNameComponent } from "./pages/auth-page/change-name/change-name.component";
import { AuthLevelManagerComponent } from "./pages/auth-page/auth-level-manager/auth-level-manager.component";
import { MyEventsComponent } from "./pages/auth-page/my-events/my-events.component";
import { EventDetailsComponent } from "./pages/events-page/event-details/event-details.component";
import { ParticipantComponent } from "./pages/events-page/event-details/participant/participant.component";

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    NotFoundPageComponent,
    EventsPageComponent,
    EventEditorComponent,
    CalendarPageComponent,
    AuthPageComponent,
    LoginComponent,
    RegisterComponent,
    ChangeNameComponent,
    AuthLevelManagerComponent,
    MyEventsComponent,
    EventDetailsComponent,
    ParticipantComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
