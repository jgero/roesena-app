import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CalendarRoutingModule } from "./calendar-routing.module";
import { CalendarComponent } from "./calendar/calendar.component";
import { DayComponent } from "./day/day.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatBadgeModule } from "@angular/material/badge";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
  declarations: [CalendarComponent, DayComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatBadgeModule,
    MatListModule,
    MatProgressBarModule,
  ],
})
export class CalendarModule {}
