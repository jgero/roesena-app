import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CalendarRoutingModule } from "./calendar-routing.module";

import { CalendarPageComponent } from "./calendar-page.component";

@NgModule({
  declarations: [CalendarPageComponent],
  imports: [CommonModule, CalendarRoutingModule]
})
export class CalendarModule {}
