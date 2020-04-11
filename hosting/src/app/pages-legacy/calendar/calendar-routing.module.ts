import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CalendarEventsResolver } from "src/app/resolvers/calendar-events.resolver";

import { CalendarPageComponent } from "./calendar-page.component";

const routes: Routes = [
  {
    path: "",
    component: CalendarPageComponent,
    resolve: { calendarEvents: CalendarEventsResolver }
  },
  {
    path: ":id",
    component: CalendarPageComponent,
    runGuardsAndResolvers: "pathParamsChange",
    resolve: { calendarEvents: CalendarEventsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule {}
