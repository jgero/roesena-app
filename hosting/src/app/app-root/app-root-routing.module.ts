import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoadUserGuard } from "../guards/load-user.guard";
import { StartPageComponent } from "./start-page/start-page.component";
import { AboutComponent } from "./about/about.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    canActivateChild: [LoadUserGuard],
    children: [
      { path: "", component: StartPageComponent },
      { path: "events", loadChildren: () => import("../pages/events/events.module").then((m) => m.EventsModule) },
      { path: "auth", loadChildren: () => import("../pages/auth/auth.module").then((m) => m.AuthModule) },
      { path: "articles", loadChildren: () => import("../pages/articles/articles.module").then((m) => m.ArticlesModule) },
      { path: "images", loadChildren: () => import("../pages/images/images.module").then((m) => m.ImagesModule) },
      { path: "calendar", loadChildren: () => import("../pages/calendar/calendar.module").then((m) => m.CalendarModule) },
      { path: "groups", loadChildren: () => import("../pages/groups/groups.module").then((m) => m.GroupsModule) },
      { path: "about", component: AboutComponent },
      { path: "**", component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRootRoutingModule {}
