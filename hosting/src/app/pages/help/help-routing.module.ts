import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ArticlesComponent } from "./articles/articles.component";
import { AuthComponent } from "./auth/auth.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { EventsComponent } from "./events/events.component";
import { GeneralComponent } from "./general/general.component";
import { ImagesComponent } from "./images/images.component";
import { RootComponent } from "./root/root.component";

const routes: Routes = [
  {
    path: "",
    component: RootComponent,
    children: [
      { path: "articles", children: [{ path: "**", component: ArticlesComponent }] },
      { path: "auth", children: [{ path: "**", component: AuthComponent }] },
      { path: "calendar", children: [{ path: "**", component: CalendarComponent }] },
      { path: "events", children: [{ path: "**", component: EventsComponent }] },
      { path: "images", children: [{ path: "**", component: ImagesComponent }] },
      { path: "**", component: GeneralComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
