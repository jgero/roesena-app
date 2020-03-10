import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StartPageComponent } from "./pages/start-page/start-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { EventsPageComponent } from "./pages/events-page/events-page.component";
import { EventEditorComponent } from "./pages/events-page/event-editor/event-editor.component";

import { EventByIdResolver } from "./resolvers/event-by-id.resolver";
import { CalendarPageComponent } from "./pages/calendar-page/calendar-page.component";
import { CalendarEventsResolver } from "./resolvers/calendar-events.resolver";
import { AuthPageComponent } from "./pages/auth-page/auth-page.component";
import { NextEventResolver } from "./resolvers/next-event.resolver";
import { LoadUserGuard } from "./guards/load-user.guard";
import { RegisterComponent } from "./pages/auth-page/register/register.component";
import { LoginComponent } from "./pages/auth-page/login/login.component";
import { ProfileComponent } from "./pages/auth-page/profile/profile.component";
import { AuthLevelManagerComponent } from "./pages/auth-page/auth-level-manager/auth-level-manager.component";
import { ChangeNameComponent } from "./pages/auth-page/change-name/change-name.component";
import { LoggedInGuard } from "./guards/logged-in.guard";

const routes: Routes = [
  {
    path: "",
    canActivate: [LoadUserGuard],
    children: [
      { path: "", component: StartPageComponent, resolve: { appEvent: NextEventResolver } },
      {
        path: "events",
        component: EventsPageComponent,
        children: [
          { path: "edit", component: EventEditorComponent },
          {
            path: "edit/:id",
            component: EventEditorComponent,
            resolve: { appEvent: EventByIdResolver }
          }
        ]
      },
      {
        path: "calendar",
        component: CalendarPageComponent,
        resolve: { calendarEvents: CalendarEventsResolver }
      },
      {
        path: "calendar/:id",
        component: CalendarPageComponent,
        runGuardsAndResolvers: "pathParamsChange",
        resolve: { calendarEvents: CalendarEventsResolver }
      },
      {
        path: "auth",
        component: AuthPageComponent,
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "profile"
          },
          {
            path: "profile",
            component: ProfileComponent,
            canActivate: [LoggedInGuard]
          },
          {
            path: "auth-level-manager",
            component: AuthLevelManagerComponent,
            canActivate: [LoggedInGuard]
          },
          {
            path: "rename",
            component: ChangeNameComponent,
            canActivate: [LoggedInGuard]
          },
          {
            path: "register",
            component: RegisterComponent
          },
          {
            path: "login",
            component: LoginComponent
          }
        ]
      }
    ]
  },
  { path: "**", component: NotFoundPageComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
