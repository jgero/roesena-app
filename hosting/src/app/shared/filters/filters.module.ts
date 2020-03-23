import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventsByDatePipe } from "./events-by-date/events-by-date.pipe";

const pipes = [EventsByDatePipe];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes
})
export class FiltersModule {}
