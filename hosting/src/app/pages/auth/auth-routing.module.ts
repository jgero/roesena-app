import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoggedInGuard } from "src/app/guards/logged-in.guard";

import { MyEventsComponent } from "./my-events/my-events.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ResetComponent } from "./reset/reset.component";
import { GroupManagerComponent } from "./group-manager/group-manager.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "my-events",
  },
  {
    path: "my-events",
    component: MyEventsComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "group-manager",
    component: GroupManagerComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "reset",
    component: ResetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
