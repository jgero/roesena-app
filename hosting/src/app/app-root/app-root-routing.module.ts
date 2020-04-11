import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoadUserGuard } from "../guards/load-user.guard";
import { StartPageComponent } from "./start-page/start-page.component";

const routes: Routes = [
  {
    path: "",
    canActivateChild: [LoadUserGuard],
    children: [
      { path: "", component: StartPageComponent },
      { path: "events", loadChildren: () => import("../pages/events/events.module").then((m) => m.EventsModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRootRoutingModule {}
