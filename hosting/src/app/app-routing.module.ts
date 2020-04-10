import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoadUserGuard } from "./guards/load-user.guard";

import { StartPageComponent } from "./app-root/start-page/start-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [LoadUserGuard],
    children: [
      { path: "", component: StartPageComponent, data: { animation: "StartPage" } },
      {
        path: "events",
        loadChildren: () => import("./pages/events/events.module").then((m) => m.EventsModule),
        data: { animation: "EventsPage" },
      },
      {
        path: "calendar",
        loadChildren: () => import("./pages/calendar/calendar.module").then((m) => m.CalendarModule),
        data: { animation: "CalendarPage" },
      },
      {
        path: "auth",
        loadChildren: () => import("./pages/auth/auth.module").then((m) => m.AuthModule),
        data: { animation: "AuthPage" },
      },
      {
        path: "images",
        loadChildren: () => import("./pages/images/images.module").then((m) => m.ImagesModule),
        data: { animation: "ImagePage" },
      },
      {
        path: "articles",
        loadChildren: () => import("./pages/articles/articles.module").then((m) => m.ArticlesModule),
        data: { animation: "ArticlePage" },
      },
      {
        path: "groups",
        loadChildren: () => import("./pages/groups/groups.module").then((m) => m.GroupsModule),
        data: { animation: "GroupsPage" },
      },
      {
        path: "help",
        loadChildren: () => import("./pages/help/help.module").then((m) => m.HelpModule),
        data: { animation: "HelpPage" },
      },
    ],
  },
  { path: "**", component: NotFoundPageComponent, pathMatch: "full", data: { animation: "NotFoundPage" } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
