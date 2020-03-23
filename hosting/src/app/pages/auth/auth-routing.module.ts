import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoggedInGuard } from "src/app/guards/logged-in.guard";
import { EventForProfileResolver } from "src/app/resolvers/event-for-profile.resolver";

import { AuthPageComponent } from "./auth-page.component";
import { LoginComponent } from "./login/login.component";
import { AuthLevelManagerComponent } from "./auth-level-manager/auth-level-manager.component";
import { ChangeNameComponent } from "./change-name/change-name.component";
import { RegisterComponent } from "./register/register.component";
import { MyEventsComponent } from "./my-events/my-events.component";

const routes: Routes = [
  {
    path: "",
    component: AuthPageComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "my-events"
      },
      {
        path: "my-events",
        component: MyEventsComponent,
        resolve: { events: EventForProfileResolver },
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
      }
    ]
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
